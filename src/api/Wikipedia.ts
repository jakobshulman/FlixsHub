export async function fetchWikipediaBio(name: string, language: string = "he"): Promise<string | null> {
  async function tryFetch(lang: string): Promise<{ extract: string | null; url: string }> {
    const encodedName = encodeURIComponent(name.trim().replace(/\(.+?\)/g, ""));
    const url = `https://${lang}.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=true&format=json&titles=${encodedName}&origin=*`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      const pages = data.query?.pages;
      if (!pages) return { extract: null, url: "" };

      const page = Object.values(pages)[0] as any;
      if (!page || !page.extract) return { extract: null, url: "" };

      // חותך לפני "== קריירה ==" או כותרות דומות
      const cutIndex = Math.min(
        ...["== Career ==", "== קריירה ==", "== חיים אישיים ==", "== פילמוגרפיה =="]
          .map(marker => page.extract.indexOf(marker))
          .filter(index => index > -1)
      );

      const raw = cutIndex > -1 ? page.extract.slice(0, cutIndex) : page.extract;
      const cleaned = raw
        .replace(/==.*==/g, "") // הסרת כותרות
        .replace(/\n{2,}/g, "\n\n")
        .trim();

      return {
        extract: cleaned,
        url: `https://${lang}.wikipedia.org/wiki/${encodedName}`
      };
    } catch (err) {
      console.error(`Error fetching Wikipedia bio (${lang}):`, err);
      return { extract: null, url: "" };
    }
  }

  // נסה בשפה הרצויה
  let { extract} = await tryFetch(language);

  // אם לא הצליח, נסה באנגלית
  if (!extract && language !== "en") {
    ({ extract} = await tryFetch("en"));
  }

  if (!extract) return null;


  return extract;
}
