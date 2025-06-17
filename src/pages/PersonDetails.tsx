// src/pages/PersonDetails.tsx
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPersonDetails, fetchPersonCredits } from '../api/tmdbApi';
import { fetchWikipediaBio } from '../api/Wikipedia';
import { fetchPersonImages, fetchPersonExternalIds } from '../api/fetchPersonImages';
import { useLanguage } from '../context/LanguageContext';
import HorizontalScroller from '../components/HorizontalScroller';

export default function PersonDetails() {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const [person, setPerson] = useState<any>(null);
  const [credits, setCredits] = useState<any[]>([]);
  const [showFullBio, setShowFullBio] = useState(false);
  const [wikiBio, setWikiBio] = useState<string | null>(null);
  const [knownForLimit, setKnownForLimit] = useState(10);
  const [images, setImages] = useState<any[]>([]);
  const [externalIds, setExternalIds] = useState<any | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    fetchPersonDetails(Number(id), language).then(async (data) => {
      setPerson(data);
      if (!data.biography) {
        const bio = await fetchWikipediaBio(data.name, language.split('-')[0]);
        setWikiBio(bio);
      } else {
        setWikiBio(null);
      }
    });
    fetchPersonCredits(Number(id), language).then(setCredits);
    fetchPersonImages(Number(id)).then(setImages);
    fetchPersonExternalIds(Number(id)).then(setExternalIds);
    setKnownForLimit(10); // reset limit on id/language change
  }, [id, language]);

  const scrollGallery = (dir: 'left' | 'right') => {
    if (galleryRef.current) {
      const scrollAmount = galleryRef.current.offsetWidth * 0.7;
      galleryRef.current.scrollBy({
        left: dir === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!person) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-4 font-sans">
      <div className="flex flex-col md:flex-row gap-6 w-full">
        {/* כרטיס תמונה רשמית */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow p-4 flex items-center justify-center flex-1 min-w-[180px]">
          {person.profile_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w300${person.profile_path}`}
              alt={person.name}
              className="rounded-lg w-40 h-40 object-cover mx-auto"
            />
          ) : (
            <div className="glyphicons_v2 picture grey poster no_image_holder w-40 h-40 rounded-lg flex items-center justify-center text-gray-400 text-4xl bg-gray-200 mx-auto"></div>
          )}
        </div>
        {/* כרטיס שם ואודות */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col justify-center flex-1 min-w-[180px]">
          <h1
            className="mb-2 text-center font-bold text-gray-800 dark:text-gray-100 text-2xl tracking-tight leading-tight"
            style={{ textShadow: 'none', fontFamily: 'inherit' }}
          >
            {person.name}
          </h1>
          <p className="text-gray-700 dark:text-gray-200 text-center">
            {person.biography && !showFullBio
              ? person.biography.split(' ').slice(0, 40).join(' ') +
                (person.biography.split(' ').length > 40 ? '...' : '')
              : person.biography ||
                (wikiBio
                  ? showFullBio
                    ? wikiBio
                    : wikiBio.split(' ').slice(0, 40).join(' ') +
                      (wikiBio.split(' ').length > 40 ? '...' : '')
                  : 'No biography available.')}
            {(person.biography && person.biography.split(' ').length > 40 && !showFullBio) ||
            (wikiBio && wikiBio.split(' ').length > 40 && !showFullBio) ? (
              <button
                className="ml-2 text-blue-500 underline text-sm"
                onClick={() => setShowFullBio(true)}
              >
                Show more
              </button>
            ) : null}
            {((person.biography && showFullBio) || (wikiBio && showFullBio)) && (
              <button
                className="ml-2 text-blue-500 underline text-sm"
                onClick={() => setShowFullBio(false)}
              >
                Show less
              </button>
            )}
            {wikiBio && (
              <a
                href={`https://${language.split('-')[0]}.wikipedia.org/wiki/${encodeURIComponent(
                  person.name,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-xs text-gray-500 underline cursor-pointer"
                style={{ display: 'inline-block' }}
              >
                (Wikipedia)
              </a>
            )}
          </p>
        </div>
        {/* כרטיס פרטים טכניים */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col justify-center flex-1 min-w-[180px]">
          <ul className="space-y-2 text-gray-700 dark:text-gray-200">
            <li className="flex items-center gap-2">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                />
              </svg>
              <span>{person.birthday || '—'}</span>
            </li>
            {person.place_of_birth && (
              <li className="flex items-center gap-2">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
                  />
                </svg>
                <span>{person.place_of_birth}</span>
              </li>
            )}
            {person.deathday && (
              <li className="flex items-center gap-2">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span>{person.deathday}</span>
              </li>
            )}
            {person.known_for_department && (
              <li className="flex items-center gap-2">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 14l9-5-9-5-9 5 9 5zm0 7v-6m0 0l-9-5m9 5l9-5"
                  />
                </svg>
                <span>{person.known_for_department}</span>
              </li>
            )}
            <li className="flex items-center gap-2 flex-wrap">
              {externalIds?.imdb_id && (
                <a
                  href={`https://www.imdb.com/name/${externalIds.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  IMDB
                </a>
              )}
              {externalIds?.twitter_id && (
                <a
                  href={`https://twitter.com/${externalIds.twitter_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Twitter
                </a>
              )}
              {externalIds?.instagram_id && (
                <a
                  href={`https://instagram.com/${externalIds.instagram_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Instagram
                </a>
              )}
              {externalIds?.facebook_id && (
                <a
                  href={`https://facebook.com/${externalIds.facebook_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Facebook
                </a>
              )}
            </li>
          </ul>
        </div>
        {/* כרטיס גלריית תמונות */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl shadow p-4 flex flex-col justify-center flex-1 min-w-[180px] relative overflow-hidden group">
          <h2 className="text-center text-lg font-semibold mb-2">Gallery</h2>
          <div className="relative">
            <button
              type="button"
              aria-label="Scroll left"
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-200 dark:bg-gray-700 rounded-full p-1 shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition ${
                images.length > 4
                  ? 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'
                  : 'hidden'
              }`}
              onClick={() => scrollGallery('left')}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div ref={galleryRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {images.length > 0 ? (
                images
                  .slice(0, 12)
                  .map((img, idx) => (
                    <img
                      key={idx}
                      src={`https://image.tmdb.org/t/p/w300${img.file_path}`}
                      alt="profile"
                      className="rounded-lg h-32 w-32 object-cover"
                      loading="lazy"
                    />
                  ))
              ) : (
                <span className="text-gray-400 text-sm text-center w-full">No images</span>
              )}
            </div>
            <button
              type="button"
              aria-label="Scroll right"
              className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-200 dark:bg-gray-700 rounded-full p-1 shadow hover:bg-gray-300 dark:hover:bg-gray-600 transition ${
                images.length > 4
                  ? 'opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'
                  : 'hidden'
              }`}
              onClick={() => scrollGallery('right')}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
          <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
        </div>
      </div>
      {/* פיצול שורת ידוע בזכות */}
      {credits.length > 0 && (
        <div className="mt-10">
          {/* סרטים */}
          <HorizontalScroller
            title="Known For: Movies"
            fetchItems={async () =>
              credits.filter((c) => c.media_type === 'movie').slice(0, knownForLimit)
            }
            type="movie"
            onScrollEnd={() => {
              if (knownForLimit < credits.filter((c) => c.media_type === 'movie').length) {
                setKnownForLimit((prev) =>
                  Math.min(prev + 10, credits.filter((c) => c.media_type === 'movie').length),
                );
              }
            }}
          />
          {/* סדרות */}
          <HorizontalScroller
            title="Known For: TV Shows"
            fetchItems={async () =>
              credits.filter((c) => c.media_type === 'tv').slice(0, knownForLimit)
            }
            type="tv"
            onScrollEnd={() => {
              if (knownForLimit < credits.filter((c) => c.media_type === 'tv').length) {
                setKnownForLimit((prev) =>
                  Math.min(prev + 10, credits.filter((c) => c.media_type === 'tv').length),
                );
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
