import * as React from "react";
import { makeStyles } from "@fluentui/react-components";
import { registerOnTextChanged } from "../taskpane";
import { useEffect, useState } from "react";
import BibleVerseReference from "./BibleVerseReference";
import { parseBibleVerses } from "../../utils/bible-api-util";

const BibleApiKey = "16c0f06d93add4528e1ff62cdcf9e162";
const baseUrl = "https://api.scripture.api.bible/v1/bibles/";
const searchApiUrl = "/search";
const bibleId = "246ad95eade0d0a1-01";

export type BibleVerseContainer = {
  query: string;
  limit: number;
  offset: number;
  total: number;
  verseCount: number;
  passages: Array<any>;
  verses: Array<BibleVerse>;
};

export type BibleVerse = {
  id: string;
  orgId: string;
  bookId: string;
  bibleId: string;
  chapterId: string;
  reference: string;
  text: string;
};

export type BibleVerseDetailed = {
  id: string;
  orgId: string;
  bibleId: string;
  bookId: string;
  chapterId: string;
  content: string;
  reference: string;
  verseCount: number;
  copyright: string;
  next: {
    id: string;
    bookId: string;
  };
  previous: {
    id: string;
    bookId: string;
  };
};

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
  },
});

async function fetchVersesFromChapter(chapterId: string) {
  const url = `${baseUrl}${bibleId}/chapters/${chapterId}?content-type=json`;
  const response = await fetch(url, {
    mode: "cors",
    headers: {
      "api-key": BibleApiKey,
    },
  });
  const data = await response.json();

  console.log(parseBibleVerses(data.data.content));

  return [];
}

async function fetchBibleVerse(verseId: string) {
  const url = `${baseUrl}${bibleId}/verses/${verseId}`;
  const response = await fetch(url, {
    mode: "cors",
    headers: {
      "api-key": BibleApiKey,
    },
  });
  const data = await response.json();
  return data.data as BibleVerseDetailed;
}

async function fetchBibleVerses(query: string) {
  // debouncing
  setTimeout(() => {}, 2000);
  const url = `${baseUrl}${bibleId}${searchApiUrl}?query=${query}&sort=relevance`;
  const response = await fetch(url, {
    mode: "cors",
    headers: {
      "api-key": BibleApiKey,
    },
  });
  const data = await response.json();

  return data.data;
}
function App() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedChapter, setSelectedChapter] = useState<string>(null);
  const [foundVerses, setFoundVerses] = useState<BibleVerse[]>(null);

  useEffect(() => {
    if (selectedChapter && selectedChapter.length > 0) {
      fetchVersesFromChapter(selectedChapter).then((data: BibleVerseDetailed[]) => {
        console.log(data);
      });
    }
  }, [selectedChapter]);

  async function searchBibleVerses() {
    if (selectedChapter && selectedChapter.length > 0) {
      return;
    }
    await Word.run(async (context) => {
      const paragraph: Word.Paragraph = context.document.body.paragraphs.getLast();
      paragraph.load("text");
      await context.sync();

      setSearchQuery(paragraph.text);

      fetchBibleVerses(paragraph.text).then((data: BibleVerseContainer) => {
        if (data.verses === undefined) {
          return;
        }
        setFoundVerses(data.verses);
      });
    });
  }

  useEffect(() => {
    registerOnTextChanged((_: any) => {
      searchBibleVerses();
    });
  }, []);

  return (
    <div className={"p-10 h-full"}>
      {selectedChapter && selectedChapter.length > 0 && (
        <button className="bg-blue-500 text-white p-2 rounded-lg mb-5" onClick={() => setSelectedChapter(null)}>
          Tilbake
        </button>
      )}
      <p className="text-small italic">Vi viser bare første 10 treff, trykk på verset for å legge inn</p>
      {foundVerses && foundVerses.length === 0 && <p>Ingen treff</p>}
      {foundVerses === null && <p className="mt-5">Skriv noe, så søker vi.. 😉 </p>}
      {foundVerses && foundVerses.length > 0 && (
        <>
          <h1 className="italic font-bold">Søkeresultat for {searchQuery}:</h1>
          <ul>
            {foundVerses &&
              foundVerses.map((verse) => (
                <BibleVerseReference
                  onShowChapter={(verse: BibleVerse) => {
                    setSelectedChapter(verse.chapterId);
                  }}
                  verse={verse}
                  key={verse.id}
                />
              ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
