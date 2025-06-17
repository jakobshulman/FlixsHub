import React from "react";
import { siteConfig } from "../config/siteConfig";

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

const options = [
  { label: "דירוג", value: "vote_average.desc" },
  { label: "פופולריות", value: "popularity.desc" },
  { label: "תאריך שחרור", value: "primary_release_date.desc" },
];

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find(o => o.value === value);
  return (
    <div className="relative inline-block text-right">
      <button
        className={`px-4 py-2 ${siteConfig.buttonColors.primaryBg} ${siteConfig.buttonColors.primaryHover} ${siteConfig.buttonColors.primaryText} rounded-full shadow transition`}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        מיון: {selected?.label || "בחר"}
      </button>
      {open && (
        <ul className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50" role="listbox">
          {options.map(opt => (
            <li
              key={opt.value}
              className={`px-4 py-2 cursor-pointer hover:bg-yellow-100 ${value === opt.value ? `font-bold ${siteConfig.buttonColors.primaryBg} ${siteConfig.buttonColors.primaryText}` : ""}`}
              onClick={() => { onChange(opt.value); setOpen(false); }}
              role="option"
              aria-selected={value === opt.value}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
