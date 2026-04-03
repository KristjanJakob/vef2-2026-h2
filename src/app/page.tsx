import Image from "next/image";
import SearchForm from "@/components/SearchForm";

export default function HomePage() {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Verkefni H2</h1>
        <p>
          Þetta er forsíða með dummy content. Hér getur komið lorem ipsum texti,
          kynning á verkefninu og mynd frá Unsplash.
        </p>
        <SearchForm />
      </div>

      <Image
        className="hero-image"
        src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
        alt="Dummy hero mynd"
        width={1200}
        height={800}
      />
    </section>
  );
}