export function parseBibleVerses(content: any[]) {
  const bibleVerses: any[] = [];

  for (var item of content) {
    const verses = item.items
      .filter((x) => x.hasOwnProperty("text") && x.text.trim().length > 0)
      .map((x) => {
        return {
          verseId: x?.attrs?.verseId ?? "",
          verseChapter: x?.attrs?.verseId.split(".")[1] ?? "",
          verseNumber: x?.attrs?.verseId.split(".")[2] ?? "",
          text: x.text,
        };
      });

    for (var verse of verses.filter((x) => x.verseId?.length > 0)) {
      bibleVerses.push(verse);
    }
  }

  return bibleVerses;
}
