"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { getToken, removeToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import {
    Category,
    EventItem,
    Location,
    MetaListResponse,
    PaginatedEventsResponse,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AdminPage() {
    const [checked, setChecked] = useState(false);
    const [allowed, setAllowed] = useState(false);
    const [userInfo, setUserInfo] = useState("");

    const [categories, setCategories] = useState<Category[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [metaLoading, setMetaLoading] = useState(true);

    const [events, setEvents] = useState<EventItem[]>([]);
    const [eventsLoading, setEventsLoading] = useState(true);
    const [eventsMessage, setEventsMessage] = useState("");
    const [deleteLoadingId, setDeleteLoadingId] = useState("");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startsAt, setStartsAt] = useState("");
    const [endsAt, setEndsAt] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [locationId, setLocationId] = useState("");
    const [status, setStatus] = useState<"PUBLISHED" | "DRAFT">("PUBLISHED");

    const [createdEventId, setCreatedEventId] = useState("");
    const [createMessage, setCreateMessage] = useState("");
    const [createLoading, setCreateLoading] = useState(false);

    const [file, setFile] = useState<File | null>(null);
    const [uploadMessage, setUploadMessage] = useState("");
    const [uploadLoading, setUploadLoading] = useState(false);

    const router = useRouter();

    async function loadAdminEvents(token: string) {
        setEventsLoading(true);
        setEventsMessage("");
      
        try {
          const res = await fetch(`${API_URL}/events?page=1&limit=50`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          });
      
          const data = (await res.json()) as PaginatedEventsResponse;
      
          if (!res.ok) {
            throw new Error("Ekki tókst að sækja viðburði.");
          }
      
          setEvents(data.data ?? []);
        } catch (err) {
          setEventsMessage(
            err instanceof Error ? err.message : "Villa kom upp við að sækja viðburði.",
          );
        } finally {
          setEventsLoading(false);
        }
    }

    useEffect(() => {
        async function verifyUserAndLoadMeta() {
        const token = getToken();

        if (!token) {
            router.push("/forbidden");
            return;
        }

        try {
            const userRes = await fetch(`${API_URL}/auth/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });

            if (!userRes.ok) {
            removeToken();
            router.push("/forbidden");
            return;
            }

            const user = (await userRes.json()) as {
            username?: string;
            role?: string;
            };

            setUserInfo(
            user.username
                ? `Innskráður sem ${user.username}${user.role ? ` (${user.role})` : ""}`
                : "Innskráður notandi",
            );

            const [categoriesRes, locationsRes] = await Promise.all([
            fetch(`${API_URL}/categories`),
            fetch(`${API_URL}/locations`),
            ]);

            if (!categoriesRes.ok || !locationsRes.ok) {
            throw new Error("Ekki tókst að sækja categories eða locations.");
            }

            const categoriesData =
            (await categoriesRes.json()) as MetaListResponse<Category>;
            const locationsData =
            (await locationsRes.json()) as MetaListResponse<Location>;

            setCategories(categoriesData.data ?? []);
            setLocations(locationsData.data ?? []);

            if (categoriesData.data?.[0]) {
            setCategoryId(categoriesData.data[0].id);
            }

            if (locationsData.data?.[0]) {
            setLocationId(locationsData.data[0].id);
            }

            await loadAdminEvents(token);

            setAllowed(true);
        } catch {
            removeToken();
            router.push("/forbidden");
        } finally {
            setChecked(true);
            setMetaLoading(false);
        }
        }

        void verifyUserAndLoadMeta();
    }, [router]);

    const imagePreviewUrl = useMemo(() => {
        if (!file) return "";
        return URL.createObjectURL(file);
    }, [file]);

    useEffect(() => {
        return () => {
        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
        }
        };
    }, [imagePreviewUrl]);

    async function handleDeleteEvent(id: string) {
        const token = getToken();
      
        if (!token) {
          setEventsMessage("Þú þarft að vera innskráður.");
          router.push("/forbidden");
          return;
        }
      
        const confirmed = window.confirm("Ertu viss um að þú viljir eyða þessum viðburði?");
        if (!confirmed) return;
      
        setDeleteLoadingId(id);
        setEventsMessage("");
      
        try {
          const res = await fetch(`${API_URL}/admin/events/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          if (!res.ok) {
            const data = await res.json().catch(() => null);
            throw new Error(data?.error || "Ekki tókst að eyða viðburði.");
          }
      
          setEvents((prev) => prev.filter((event) => event.id !== id));
      
          if (createdEventId === id) {
            setCreatedEventId("");
            setFile(null);
            setUploadMessage("");
          }
        } catch (err) {
          setEventsMessage(
            err instanceof Error ? err.message : "Villa kom upp við að eyða viðburði.",
          );
        } finally {
          setDeleteLoadingId("");
        }
    }

    async function handleCreateEvent(e: FormEvent) {
        e.preventDefault();

        const token = getToken();

        if (!token) {
        setCreateMessage("Þú þarft að vera innskráður.");
        router.push("/forbidden");
        return;
        }

        setCreateLoading(true);
        setCreateMessage("");

        try {
        const body = {
            title,
            description,
            startsAt: new Date(startsAt).toISOString(),
            endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
            categoryId,
            locationId,
            status,
        };

        const res = await fetch(`${API_URL}/admin/events`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
            throw new Error(data?.error || "Ekki tókst að búa til viðburð.");
        }

        setCreatedEventId(data.id);
        setCreateMessage(`Viðburður búinn til. Event ID: ${data.id}`);

        setEvents((prev) => [data, ...prev]);

        setTitle("");
        setDescription("");
        setStartsAt("");
        setEndsAt("");
        setStatus("PUBLISHED");
        } catch (err) {
        setCreateMessage(
            err instanceof Error ? err.message : "Villa kom upp við stofnun viðburðar.",
        );
        } finally {
        setCreateLoading(false);
        }
    }

    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const selectedFile = e.target.files?.[0] ?? null;
        setFile(selectedFile);
        setUploadMessage("");
    }

    async function handleUpload() {
        if (!createdEventId.trim()) {
        setUploadMessage("Búðu fyrst til viðburð.");
        return;
        }

        if (!file) {
        setUploadMessage("Veldu mynd fyrst.");
        return;
        }

        const token = getToken();

        if (!token) {
        setUploadMessage("Þú þarft að vera innskráður.");
        router.push("/forbidden");
        return;
        }

        setUploadLoading(true);
        setUploadMessage("");

        try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(
            `${API_URL}/admin/events/${encodeURIComponent(createdEventId)}/images`,
            {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
            },
        );

        const data = await res.json().catch(() => null);

        if (!res.ok) {
            throw new Error(data?.error || `Upload mistókst (${res.status})`);
        }

        setUploadMessage("Mynd var hlaðin upp á viðburð.");
        setFile(null);
        } catch (err) {
        setUploadMessage(err instanceof Error ? err.message : "Villa við upload.");
        } finally {
        setUploadLoading(false);
        }
    }

    if (!checked) {
        return <p>Hleð admin svæði...</p>;
    }

    if (!allowed) {
        return null;
    }

    return (
        <section className="admin-page">
        <div className="page-heading">
            <div>
            <h1>Admin svæði</h1>
            <p>Hér geturðu búið til viðburð og hlaðið mynd upp á hann.</p>
            </div>
        </div>

        <div className="message-box">
            <p>{userInfo}</p>
        </div>

        <div className="admin-card">
            <h2>Búa til viðburð</h2>

            {metaLoading ? (
            <p>Hleð categories og locations...</p>
            ) : (
            <form onSubmit={handleCreateEvent} className="form">
                <div>
                <label htmlFor="title">Titill</label>
                <input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                </div>

                <div>
                <label htmlFor="description">Lýsing</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={6}
                />
                </div>

                <div>
                <label htmlFor="startsAt">Byrjar</label>
                <input
                    id="startsAt"
                    type="datetime-local"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    required
                />
                </div>

                <div>
                <label htmlFor="endsAt">Endar</label>
                <input
                    id="endsAt"
                    type="datetime-local"
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                />
                </div>

                <div>
                <label htmlFor="categoryId">Flokkur</label>
                <select
                    id="categoryId"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    required
                >
                    {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                    ))}
                </select>
                </div>

                <div>
                <label htmlFor="locationId">Staðsetning</label>
                <select
                    id="locationId"
                    value={locationId}
                    onChange={(e) => setLocationId(e.target.value)}
                    required
                >
                    {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                        {location.name}
                    </option>
                    ))}
                </select>
                </div>

                <div>
                <label htmlFor="status">Staða</label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) =>
                    setStatus(e.target.value as "PUBLISHED" | "DRAFT")
                    }
                >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                </select>
                </div>

                <button type="submit" className="button" disabled={createLoading}>
                {createLoading ? "Bý til..." : "Búa til viðburð"}
                </button>

                {createMessage ? <p>{createMessage}</p> : null}
            </form>
            )}
        </div>

        <div className="admin-card">
            <h2>Setja inn mynd á nýjan viðburð</h2>

            <div className="form">
            <div>
                <label>Event ID</label>
                <input value={createdEventId} readOnly placeholder="Kemur sjálfkrafa eftir stofnun" />
            </div>

            <div>
                <label htmlFor="image">Velja mynd</label>
                <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={!createdEventId}
                />
            </div>

            {imagePreviewUrl ? (
                <div className="admin-image-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagePreviewUrl} alt="Forskoðun" />
                </div>
            ) : null}

            <button
                type="button"
                onClick={handleUpload}
                className="button"
                disabled={uploadLoading || !createdEventId}
            >
                {uploadLoading ? "Hleð upp..." : "Hlaða upp mynd"}
            </button>

            {uploadMessage ? <p>{uploadMessage}</p> : null}
            </div>
        </div>

        <div className="admin-card">
            <h2>Allir viðburðir</h2>

            {eventsLoading ? <p>Hleð viðburðum...</p> : null}
            {eventsMessage ? <p className="error">{eventsMessage}</p> : null}

            {!eventsLoading && events.length === 0 ? (
                <p>Engir viðburðir fundust.</p>
            ) : null}

            {!eventsLoading && events.length > 0 ? (
                <div className="admin-events-list">
                {events.map((event) => {
                    const imageUrl = event.images?.[0]?.url;

                    return (
                    <article key={event.id} className="admin-event-item">
                        <div className="admin-event-info">
                        <h3>{event.title}</h3>

                        {event.description ? (
                            <p>{event.description}</p>
                        ) : (
                            <p>Engin lýsing.</p>
                        )}

                        <div className="admin-event-meta">
                            {event.category?.name ? (
                            <span>Flokkur: {event.category.name}</span>
                            ) : null}

                            {event.location?.name ? (
                            <span>Staðsetning: {event.location.name}</span>
                            ) : null}

                            {event.status ? <span>Staða: {event.status}</span> : null}

                            {event.startsAt ? (
                            <span>
                                Byrjar: {new Date(event.startsAt).toLocaleString("is-IS")}
                            </span>
                            ) : null}
                        </div>

                        <div className="admin-event-actions">
                            <button
                            type="button"
                            className="button secondary"
                            onClick={() => setCreatedEventId(event.id)}
                            >
                            Velja fyrir upload
                            </button>

                            <button
                            type="button"
                            className="button danger"
                            onClick={() => handleDeleteEvent(event.id)}
                            disabled={deleteLoadingId === event.id}
                            >
                            {deleteLoadingId === event.id ? "Eyði..." : "Eyða"}
                            </button>
                        </div>
                        </div>

                        {imageUrl ? (
                        <div className="admin-event-thumb">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={imageUrl} alt={event.title} />
                        </div>
                        ) : null}
                    </article>
                    );
                })}
                </div>
            ) : null}
            </div>
        </section>
    );
}