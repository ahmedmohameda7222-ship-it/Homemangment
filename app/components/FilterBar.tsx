"use client";

import { useState } from "react";

interface FilterBarProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

export default function FilterBar({ options, value, onChange }: FilterBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            value === opt.value
              ? "bg-olive text-cream shadow-sm"
              : "bg-cream text-navy-muted border border-warm-gray/60 hover:bg-cream-dark"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
