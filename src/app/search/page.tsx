import { fetchApi } from "@/lib/api";
import { EventItem, PaginatedEventsResponse } from "@/types";
import EventCard from "@/components/EventCard";
import SearchForm from "@/components/SearchForm";

type Props = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.q ?? "";

  let events: EventItem[] = [];
  let error = "";

  if (q) {
    try {
      const result = await fetchApi<PaginatedEventsResponse>(
        `/events?search=${encodeURIComponent(q)}`,
      );
      events = result.data ?? [];
    } catch (err) {
      error = err instanceof Error ? err.message : "Villa kom upp";
    }
  }

  return (
    <section>
      <h1>Leit</h1>
      <SearchForm />

      {!q ? <p>Sláðu inn leitarskilyrði.</p> : null}
      {error ? <p className="error">{error}</p> : null}
      {q && !error && events.length === 0 ? <p>Engar niðurstöður fundust.</p> : null}

      <div className="grid">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}