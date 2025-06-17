import React from "react";
import { siteConfig } from "../config/siteConfig";

interface LanguageDetectedModalProps {
  language: string;
  languages: { iso_639_1: string; english_name: string; name: string }[];
  onChange: (lang: string) => void;
  onClose: () => void;
}

export default function LanguageDetectedModal({ language, languages, onChange, onClose }: LanguageDetectedModalProps) {
  const current = languages.find(l => l.iso_639_1 === language);
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-fadein">
      <div className={`flex items-center gap-4 ${siteConfig.buttonColors.primaryBg} shadow-lg px-6 py-3 w-full`}>
        <span className="text-gray-900 font-semibold text-base">
          השפה שנבחרה עבורך היא:
          <span className="ml-1 font-bold">{current ? current.english_name : language}</span>
          <span className="ml-1 text-xs text-gray-700">(על בסיס מיקום גאוגרפי)</span>
        </span>
        <select
          value={language}
          onChange={e => onChange(e.target.value)}
          className="ml-4 px-3 py-1 border-2 border-yellow-400 bg-white text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          {languages.map(lang => (
            <option key={lang.iso_639_1} value={lang.iso_639_1}>
              {lang.english_name} {lang.name && lang.name !== lang.english_name ? `(${lang.name})` : ""}
            </option>
          ))}
        </select>
        <button
          className="ml-auto bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold px-4 py-1 transition shadow focus:outline-none focus:ring-2 focus:ring-yellow-400"
          onClick={onClose}
        >
          סגור
        </button>
      </div>
    </div>
  );
}
