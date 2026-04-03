import Image from "next/image";
import Link from "next/link";
import { EventItem } from "@/types";

type Props = {
  event: EventItem;
};

export default function EventCard({ event }: Props) {
  const imageUrl = event.images?.[0]?.url;

  return (
    <article className="card">
      {imageUrl ? (
        <Image
          src={imageUrl}
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
            <strong>Byrjar:</strong> {new Date(event.startsAt).toLocaleString("is-IS")}
          </p>
        ) : null}

        <Link href={`/events/${event.id}`} className="button">
          Skoða nánar
        </Link>
      </div>
    </article>
  );
}