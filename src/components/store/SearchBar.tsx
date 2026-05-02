"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useRef, useState, useTransition } from "react";

export default function SearchBar({ locale }: { locale: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get("q") ?? "");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (term: string) => {
    setValue(term);
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const clear = () => {
    handleSearch("");
    inputRef.current?.focus();
  };

  return (
    <div
      className={`relative flex items-center w-full sm:w-80 transition-all duration-300 ${
        focused ? "sm:w-96" : ""
      }`}
    >
      {/* Gold accent line on focus */}
      <div
        className={`absolute bottom-0 left-0 h-px bg-gold transition-all duration-300 ${
          focused ? "w-full" : "w-0"
        }`}
      />

      {/* Search icon */}
      <div className="absolute left-0 flex items-center pointer-events-none">
        <Search
          size={13}
          className={`transition-colors duration-200 ${
            focused ? "text-gold" : "text-foreground/25"
          }`}
        />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Rechercher une montre..."
        className="w-full bg-transparent border-b border-border/40 text-foreground text-sm pl-6 pr-7 py-2.5 focus:outline-none transition-colors placeholder:text-foreground/20 placeholder:tracking-wide"
      />

      {/* Clear button */}
      {value && !isPending && (
        <button
          onClick={clear}
          className="absolute right-0 text-foreground/25 hover:text-gold transition-colors"
        >
          <X size={13} />
        </button>
      )}

      {/* Spinner */}
      {isPending && (
        <div className="absolute right-0 w-3 h-3 border border-gold border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  );
}
