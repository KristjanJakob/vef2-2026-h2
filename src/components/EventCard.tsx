import Image from "next/image";
import Link from "next/link";
import { EventItem } from "@/types";

type Props = {
  event: EventItem;
};

export default function EventCard({ event }: Props) {
  return (
    <article className="card">
      {event.image ? (
        <Image
          src={event.image}
          alt={event.title}
          className="card-image"
          width={800}
          height={500}
        />
      ) : (
        <div className="card-image placeholder">No image</div>
      )}

      <div className="card-content">
        <h2>{event.title}</h2>
        {event.description ? <p>{event.description}</p> : <p>Engin lýsing.</p>}
        {event.location ? (
          <p>
            <strong>Staður:</strong> {event.location}
          </p>
        ) : null}
        <Link href={`/events/${event.id}`} className="button">
          Skoða nánar
        </Link>
      </div>
    </article>
  );
}