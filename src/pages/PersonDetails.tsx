// src/pages/PersonDetails.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPersonDetails, fetchPersonCredits } from "../api/tmdbApi";
import { fetchWikipediaBio } from "../api/Wikipedia";
import { useLanguage } from "../context/LanguageContext";
import HorizontalScroller from "../components/HorizontalScroller";

export default function PersonDetails() {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [person, setPerson] = useState<any>(null);
  const [credits, setCredits] = useState<any[]>([]);
  const [showFullBio, setShowFullBio] = useState(false);
  const [wikiBio, setWikiBio] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchPersonDetails(Number(id), language).then(async (data) => {
      setPerson(data);
      if (!data.biography) {
        const bio = await fetchWikipediaBio(data.name, language.split("-")[0]);
        setWikiBio(bio);
      } else {
        setWikiBio(null);
      }
    });
    fetchPersonCredits(Number(id), language).then(setCredits);
  }, [id, language]);

  if (!person) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto font-sans">

      <div className="flex flex-col md:flex-row gap-6">
        {person.profile_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
            alt={person.name}
            className="rounded w-full md:w-1/3 h-[270px] object-cover"
          />
        ) : (
          <div className="glyphicons_v2 picture grey poster no_image_holder w-full md:w-1/3 h-[270px] rounded flex items-center justify-center text-gray-400 text-4xl bg-gray-200"></div>
        )}
        <div>
          <h1 className="text-3xl font-bold mb-2">{person.name}</h1>
          <p className="text-gray-600 mb-2">Born: {person.birthday}</p>
          {person.place_of_birth && <p className="text-gray-600 mb-2">Place: {person.place_of_birth}</p>}
          <p className="mt-4">
            {person.biography && !showFullBio
              ? person.biography.split(" ").slice(0, 40).join(" ") + (person.biography.split(" ").length > 40 ? "..." : "")
              : person.biography || (wikiBio ? (showFullBio ? wikiBio : wikiBio.split(" ").slice(0, 40).join(" ") + (wikiBio.split(" ").length > 40 ? "..." : "")) : "No biography available.")}
            {(person.biography && person.biography.split(" ").length > 40 && !showFullBio) || (wikiBio && wikiBio.split(" ").length > 40 && !showFullBio) ? (
              <button
                className="ml-2 text-blue-500 underline text-sm"
                onClick={() => setShowFullBio(true)}
              >
                קרא עוד
              </button>
            ) : null}
            {((person.biography && showFullBio) || (wikiBio && showFullBio)) && (
              <button
                className="ml-2 text-blue-500 underline text-sm"
                onClick={() => setShowFullBio(false)}
              >
                הצג פחות
              </button>
            )}
            {wikiBio && (
              <a
                href={`https://${language.split("-")[0]}.wikipedia.org/wiki/${encodeURIComponent(person.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-xs text-gray-500 underline cursor-pointer"
                style={{ display: 'inline-block' }}
              >
                (המידע מתוך ויקיפדיה)
              </a>
            )}
          </p>
        </div>
      </div>

      {credits.length > 0 && (
        <div className="mt-10">
          <HorizontalScroller
            title="Known For"
            fetchItems={async () => credits.slice(0, 10)}
            type="mixed"
          />
        </div>
      )}
    </div>
  );
}