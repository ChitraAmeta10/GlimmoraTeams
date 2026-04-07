"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";
import { COUNTRIES_DATA } from "../data";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function CountryCombobox({ value, onChange }: Props) {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");
  const ref                 = useRef<HTMLDivElement>(null);
  const inputRef            = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  const filtered = COUNTRIES_DATA.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const selected = COUNTRIES_DATA.find(c => c.name === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={`flex h-10 w-full items-center justify-between gap-2 rounded-xl border bg-white px-3 text-sm shadow-sm transition-all focus:outline-none ${
          open
            ? "border-brown-500 ring-2 ring-brown-500/20"
            : "border-beige-200 hover:border-beige-300"
        }`}
      >
        {selected ? (
          <span className="flex items-center gap-2">
            <span className={`fi fi-${selected.iso} text-base`} />
            <span className="text-brown-950">{selected.name}</span>
          </span>
        ) : (
          <span className="text-beige-400">Select your country</span>
        )}
        <ChevronDown className={`h-4 w-4 text-beige-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 rounded-xl border border-beige-200 bg-white shadow-xl overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-beige-100">
            <Search className="w-3.5 h-3.5 text-beige-400 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for a country"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 text-sm text-brown-950 bg-transparent outline-none placeholder:text-beige-400"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} className="text-beige-400 hover:text-beige-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="max-h-48 overflow-y-auto overscroll-contain">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-sm text-beige-400 text-center">No country found</p>
            ) : (
              filtered.map(c => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => { onChange(c.name); setOpen(false); setSearch(""); }}
                  className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-left transition-colors ${
                    value === c.name
                      ? "bg-brown-50 text-brown-900 font-medium"
                      : "text-brown-800 hover:bg-beige-50"
                  }`}
                >
                  <span className={`fi fi-${c.iso} text-base w-6 shrink-0`} />
                  <span className="flex-1">{c.name}</span>
                  {value === c.name && <Check className="w-3.5 h-3.5 text-brown-600 shrink-0" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
