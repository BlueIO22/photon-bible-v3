import React, { useState } from "react";
import { insertText } from "../taskpane";
import { BibleVerse } from "./App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faShare } from "@fortawesome/free-solid-svg-icons";

export default function BibleVerseReference({
  verse,
  onShowChapter,
}: {
  verse: BibleVerse;
  onShowChapter: (verse: BibleVerse) => void;
}) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <li
      className="shadow-none cursor-pointer hover:shadow-lg transition-all rounded-lg p-5"
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <h2
        style={{
          fontWeight: "bold",
        }}
      >
        {verse.reference}
      </h2>
      <p>{verse.text}</p>
      {isHovering && (
        <div className="flex justify-end gap-2">
          <button className="bg-gray-500 text-white p-2 rounded-lg mt-2" onClick={() => onShowChapter(verse)}>
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button
            className="bg-blue-500 text-white p-2 rounded-lg mt-2"
            onClick={() => insertText(verse.reference + " - " + verse.text)}
          >
            <FontAwesomeIcon icon={faShare} />
          </button>
        </div>
      )}
    </li>
  );
}
