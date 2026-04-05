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
    <div className="relative w-full sm:w-72">
      <Search
        size={14}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30 pointer-events-none"
      />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Rechercher une montre..."
        className="w-full bg-surface border border-border text-foreground text-sm pl-9 pr-8 py-2 focus:outline-none focus:border-gold transition-colors placeholder:text-foreground/30"
      />
      {value && (
        <button
          onClick={clear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground transition-colors"
        >
          <X size={13} />
        </button>
      )}
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 border border-gold border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  );
}
