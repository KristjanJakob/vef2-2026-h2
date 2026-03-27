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
  const page = Number(params.page ?? "1");

  let events: EventItem[] = [];
  let error = "";

  try {
    const result = await fetchApi<PaginatedEventsResponse>(
      `/events?page=${page}&limit=10`,
    );
    events = result.data ?? [];
  } catch (err) {
    error = err instanceof Error ? err.message : "Villa kom upp";
  }

  if (error) {
    return <p className="error">Ekki tókst að sækja viðburði: {error}</p>;
  }

  if (events.length === 0) {
    return <p>Engir viðburðir fundust.</p>;
  }

  return (
    <section>
      <h1>Viðburðir</h1>
      <div className="grid">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}