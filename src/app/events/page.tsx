import Link from "next/link";
import { fetchApi } from "@/lib/api";
import { EventItem, PaginatedEventsResponse } from "@/types";
import EventCard from "@/components/EventCard";

type Props = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function EventsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? "1"));

  let events: EventItem[] = [];
  let error = "";
  let hasNext = false;
  let total = 0;

  try {
    const result = await fetchApi<PaginatedEventsResponse>(
      `/events?page=${page}&limit=10`,
    );

    events = result.data ?? [];
    hasNext = result.hasNext ?? false;
    total = result.total ?? 0;
  } catch (err) {
    error = err instanceof Error ? err.message : "Villa kom upp";
  }

  if (error) {
    return (
      <section className="events-page">
        <div className="page-heading">
          <h1>Viðburðir</h1>
          <p>Skoðaðu alla viðburði sem eru í boði.</p>
        </div>

        <div className="message-box error-box">
          <p>Ekki tókst að sækja viðburði: {error}</p>
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="events-page">
        <div className="page-heading">
          <h1>Viðburðir</h1>
          <p>Skoðaðu alla viðburði sem eru í boði.</p>
        </div>

        <div className="message-box empty-box">
          <p>Engir viðburðir fundust.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="events-page">
      <div className="page-heading">
        <div>
          <h1>Viðburðir</h1>
          <p>Skoðaðu alla viðburði sem eru í boði.</p>
        </div>

        <div className="results-meta">
          <span>Fjöldi viðburða: {total}</span>
          <span>Síða {page}</span>
        </div>
      </div>

      <div className="grid">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      <div className="pagination">
        {page > 1 ? (
          <Link href={`/events?page=${page - 1}`} className="button secondary">
            Fyrri síða
          </Link>
        ) : (
          <span className="button secondary button-disabled">Fyrri síða</span>
        )}

        {hasNext ? (
          <Link href={`/events?page=${page + 1}`} className="button">
            Næsta síða
          </Link>
        ) : (
          <span className="button button-disabled">Næsta síða</span>
        )}
      </div>

      <div className="results-meta" style={{ justifyContent: 'flex-end' }}>
          <span>Síða {page}</span>
        </div>
    </section>
    
  );
}