import { fetchApi } from "@/lib/api";

export default async function EventsPage() {
  const data = await fetchApi<any[]>("/events");

  if (!data || data.length === 0) {
    return <p>Engir viðburðir fundust</p>;
  }

  return (
    <div>
      <h1>Events</h1>
      {data.map((event) => (
        <div key={event.id}>{event.title}</div>
      ))}
    </div>
  );
}