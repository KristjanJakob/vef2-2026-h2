import Image from "next/image";
import { notFound } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { EventItem, PaginatedEventsResponse } from "@/types";
import EventCard from "@/components/EventCard";

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function EventDetailPage({ params }: Props) {
    const { id } = await params;
  
    try {
      const event = await fetchApi<EventItem>(`/events/${id}`);
      const imageUrl = event.images?.[0]?.url;
  
      return (
        <article className="event-detail">
          <div className="event-detail-header">
            <div>
              <p className="event-detail-kicker">Viðburður</p>
              <h1>{event.title}</h1>
            </div>
          </div>
  
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={event.title}
              width={1200}
              height={700}
              className="event-detail-image"
            />
          ) : (
            <div className="event-detail-image placeholder">No image</div>
          )}
  
          <div className="event-detail-grid">
            <section className="event-detail-main">
              <h2>Lýsing</h2>
              <p>{event.description ?? "Engin lýsing tiltæk."}</p>
            </section>
  
            <aside className="event-detail-sidebar">
              <div className="detail-card">
                <h3>Upplýsingar</h3>
  
                {event.location?.name ? (
                  <p>
                    <strong>Staðsetning:</strong> {event.location.name}
                  </p>
                ) : null}
  
                {event.category?.name ? (
                  <p>
                    <strong>Flokkur:</strong> {event.category.name}
                  </p>
                ) : null}
  
                {event.startsAt ? (
                  <p>
                    <strong>Byrjar:</strong>{" "}
                    {new Date(event.startsAt).toLocaleString("is-IS")}
                  </p>
                ) : null}
  
                {event.endsAt ? (
                  <p>
                    <strong>Endar:</strong>{" "}
                    {new Date(event.endsAt).toLocaleString("is-IS")}
                  </p>
                ) : null}
              </div>
            </aside>
          </div>
        </article>
      );
    } catch {
      notFound();
    }
}