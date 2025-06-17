// src/api/tmdbApi.ts
import axiosInstance from "./axiosInstance";

type GenreWithCount = {
  id: number;
  name: string;
  count: number;
};


// 1. 10 סדרות פופולריות
export async function fetchPopularTVShows(language = "en-US") {
  try {
    const res = await axiosInstance.get(`/tv/popular?language=${language}`);
    return res.data.results.slice(0, 10);
  } catch (error) {
    console.error("Failed to fetch popular TV shows:", error);
    return [];
  }
}

// 2. 10 סרטים פופולריים
export async function fetchPopularMovies(language = "en-US") {
  try {
    const res = await axiosInstance.get(`/movie/popular?language=${language}`);
    return res.data.results.slice(0, 10);
  } catch (error) {
    console.error("Failed to fetch popular movies:", error);
    return [];
  }
}

// 3. 10 שחקנים פופולריים
export async function fetchPopularPeople(language = "en-US") {
  try {
    const res = await axiosInstance.get(`/person/popular?language=${language}`);
    return res.data.results.slice(0, 10);
  } catch (error) {
    console.error("Failed to fetch popular people:", error);
    return [];
  }
}

// 4. רשימת ז'נרים

export async function fetchTopGenres(language = "en-US") {
  const res = await axiosInstance.get(`/genre/movie/list?language=${language}`);
  const genres: GenreWithCount[] = res.data.genres.map((genre: any) => ({
    id: genre.id,
    name: genre.name,
    count: 0, // נעדכן את הספירה מאוחר יותר
  }));

  // נעדכן את ספירת הסרטים בכל ז'אנר
  const moviesRes = await axiosInstance.get(`/discover/movie?language=${language}`);
  moviesRes.data.results.forEach((movie: any) => {
    movie.genre_ids.forEach((id: number) => {
      const genre = genres.find((g) => g.id === id);
      if (genre) genre.count++;
    });
  });

  return genres.sort((a, b) => b.count - a.count).slice(0, 10);
}
// 5. טריילרים לסרטים פופולריים
export async function fetchPopularMovieTrailers(language = "en-US") {
  const res = await axiosInstance.get(`/movie/popular?language=${language}`);
  const movies = res.data.results.slice(0, 10);

  const trailers = await Promise.all(
    movies.map(async (movie: any) => {
      const videoRes = await axiosInstance.get(
        `/movie/${movie.id}/videos?language=${language}`
      );
      const trailer = videoRes.data.results.find(
        (v: any) => v.type === "Trailer" && v.site === "YouTube"
      );
      return { ...movie, trailerKey: trailer ? trailer.key : null };
    })
  );

  return trailers;
}
// 6. טריילרים לסדרות פופולריות
export async function fetchPopularTVTrailers(language = "en-US") {
  const res = await axiosInstance.get(`/tv/popular?language=${language}`);
  const shows = res.data.results.slice(0, 10);

  const trailers = await Promise.all(
    shows.map(async (show: any) => {
      const videoRes = await axiosInstance.get(
        `/tv/${show.id}/videos?language=${language}`
      );
      const trailer = videoRes.data.results.find(
        (v: any) => v.type === "Trailer" && v.site === "YouTube"
      );
      return { ...show, trailerKey: trailer ? trailer.key : null };
    })
  );

  return trailers;
}
// 7. פרטי סרט כולל קאסט
export async function fetchMovieDetails(id: number, language = "en-US") {
  const [movieRes, creditsRes] = await Promise.all([
    axiosInstance.get(`/movie/${id}?language=${language}`),
    axiosInstance.get(`/movie/${id}/credits?language=${language}`),
  ]);

  const movie = movieRes.data;
  const cast = creditsRes.data.cast.slice(0, 10); // מציג רק את 10 הראשיים
  const crew = creditsRes.data.crew.filter((m: any) => m.job === "Director");

  return {
    ...movie,
    cast,
    director: crew.length > 0 ? crew.map((d: any) => d.name).join(", ") : null,
  };
}
// 8. פרטי סדרה כולל קאסט
export async function fetchTVDetails(id: number, language = "en-US") {
  const [showRes, creditsRes] = await Promise.all([
    axiosInstance.get(`/tv/${id}?language=${language}`),
    axiosInstance.get(`/tv/${id}/credits?language=${language}`),
  ]);

  const show = showRes.data;
  const cast = creditsRes.data.cast.slice(0, 10); // מציג רק את 10 הראשיים
  const crew = creditsRes.data.crew.filter((m: any) => m.job === "Director");

  return {
    ...show,
    cast,
    director: crew.length > 0 ? crew.map((d: any) => d.name).join(", ") : null,
  };
}
// 9. מחזיר את כל הז'אנרים
export async function fetchAllGenres(language = "en-US") {
  const [movieGenresRes, tvGenresRes] = await Promise.all([
    axiosInstance.get(`/genre/movie/list?language=${language}`),
    axiosInstance.get(`/genre/tv/list?language=${language}`),
  ]);
  // איחוד ומניעת כפילויות
  const all = [...movieGenresRes.data.genres, ...tvGenresRes.data.genres];
  const unique = Array.from(new Map(all.map(g => [g.id, g])).values());
  return unique;
}

// פונקציה שמחזירה 10 סרטים פופולריים לפי מדינת מקור (discover + with_origin_country)
export async function fetchPopularMoviesByUserCountry(language = "en-US", countryCode?: string) {
  try {
    // קבלת קוד מדינה מהקונטקסט או פרמטר
    if (!countryCode) {
      // נסה לשלוף מה-localStorage או ברירת מחדל
      countryCode = localStorage.getItem("countryCode") || "US";
    }
    if (!countryCode) throw new Error("No country code found");
    const moviesRes = await axiosInstance.get(
      `/discover/movie?language=${language}&sort_by=popularity.desc&page=1&with_origin_country=${countryCode}`
    );
    return moviesRes.data.results.slice(0, 10);
  } catch (e) {
    // fallback: מחזיר סרטים פופולריים גלובליים
    try {
      const fallbackRes = await axiosInstance.get(`/movie/popular?language=${language}`);
      return fallbackRes.data.results.slice(0, 10);
    } catch (err) {
      console.error("Failed to fetch popular movies by user country:", err);
      return [];
    }
  }
}
// 10 סדרות פופולריות לפי מדינת מקור (discover + with_origin_country)
export async function fetchPopularTVShowsByUserCountry(language = "en-US", countryCode?: string) {
  try {
    if (!countryCode) {
      countryCode = localStorage.getItem("countryCode") || "US";
    }
    if (!countryCode) throw new Error("No country code found");
    const showsRes = await axiosInstance.get(
      `/discover/tv?language=${language}&sort_by=popularity.desc&page=1&with_origin_country=${countryCode}`
    );
    return showsRes.data.results.slice(0, 10);
  } catch (e) {
    try {
      const fallbackRes = await axiosInstance.get(`/tv/popular?language=${language}`);
      return fallbackRes.data.results.slice(0, 10);
    } catch (err) {
      console.error("Failed to fetch popular TV shows by user country:", err);
      return [];
    }
  }
}

export async function fetchPersonDetails(id: number, language = "en-US") {
  // שליפת פרטי אדם בלבד
  const personRes = await axiosInstance.get(`/person/${id}?language=${language}`);

  let biography = personRes.data.biography;
  if (!biography && language !== "en-US") {
    const fallbackRes = await axiosInstance.get(`/person/${id}`);
    biography = fallbackRes.data.biography;
  }

  return {
    ...personRes.data,
    biography,
  };
}

export async function fetchPersonCredits(id: number, language = "en-US") {
  try {
    const res = await axiosInstance.get(`/person/${id}/combined_credits`, {
      params: { language },
    });

    const cast = res.data.cast;

    const filtered = cast.filter(
      (item: any) =>
        item.character &&
        !item.character.toLowerCase().startsWith("self") &&
        (item.media_type === "movie" || item.media_type === "tv")
    );

    // סינון כפילויות לפי ID
    const uniqueMap = new Map();
    filtered.forEach((item: any) => {
      if (!uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    });

    const uniqueItems = Array.from(uniqueMap.values());

    return uniqueItems.sort((a: any, b: any) => (b.popularity || 0) - (a.popularity || 0));
  } catch (err) {
    console.error("Error fetching person credits:", err);
    return [];
  }
}

// פונקציה גנרית לטריילרים
export async function fetchPopularTrailers(type: "movie" | "tv", language = "en-US") {
  const res = await axiosInstance.get(`/${type}/popular?language=${language}`);
  const items = res.data.results.slice(0, 10);

  const trailers = await Promise.all(
    items.map(async (item: any) => {
      const videoRes = await axiosInstance.get(
        `/${type}/${item.id}/videos?language=${language}`
      );
      const trailer = videoRes.data.results.find(
        (v: any) => v.type === "Trailer" && v.site === "YouTube"
      );
      return { ...item, trailerKey: trailer ? trailer.key : null };
    })
  );

  return trailers;
}

// שמירה לאחור: פונקציות ישנות (אפשר למחוק בהמשך)
// export async function fetchPopularMovieTrailers(language = "en-US") {
//   return fetchPopularTrailers("movie", language);
// }
// export async function fetchPopularTVTrailers(language = "en-US") {
//   return fetchPopularTrailers("tv", language);
// }
