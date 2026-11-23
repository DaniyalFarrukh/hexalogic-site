"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { COUNTRIES, CountryCode } from "@/lib/countries";
import styles from "./CountrySelector.module.css";

interface CountrySelectorProps {
  value: string;
  onChange: (iso: string) => void;
  disabled?: boolean;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

function getFlagUrl(iso: string): string {
  return `https://flagcdn.com/w40/${iso.toLowerCase()}.png`;
}

export default function CountrySelector({
  value,
  onChange,
  disabled = false,
  containerRef,
}: CountrySelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement | null>(null);

  const selected: CountryCode =
    COUNTRIES.find((c) => c.iso === value) ?? COUNTRIES[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.toLowerCase().includes(q) ||
        c.iso.toLowerCase().includes(q)
    );
  }, [query]);

  useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      searchRef.current?.focus();
    }, 0);

    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, containerRef]);

  function handleSelect(iso: string) {
    onChange(iso);
    setOpen(false);
    setQuery("");
  }

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => {
          if (disabled) return;
          setOpen((prev) => {
            if (!prev) setQuery("");
            return !prev;
          });
        }}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Country code: ${selected.name} ${selected.dialCode}`}
      >
        <img
          src={getFlagUrl(selected.iso)}
          alt=""
          width={22}
          height={15}
          className={styles.flagImg}
        />
        <span className={styles.dialCode}>{selected.dialCode}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className={styles.dropdown} role="dialog" aria-label="Select country">
          <div className={styles.searchWrap}>
            <input
              ref={searchRef}
              type="text"
              className={styles.searchInput}
              placeholder="Search country..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search country"
            />
          </div>
          <div className={styles.list} role="listbox">
            {filtered.length === 0 ? (
              <div className={styles.empty}>No countries found</div>
            ) : (
              filtered.map((country) => {
                const isSelected = country.iso === selected.iso;
                return (
                  <button
                    key={country.iso}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`${styles.option} ${
                      isSelected ? styles.optionSelected : ""
                    }`}
                    onClick={() => handleSelect(country.iso)}
                  >
                    <img
                      src={getFlagUrl(country.iso)}
                      alt=""
                      width={22}
                      height={15}
                      loading="lazy"
                      className={styles.flagImg}
                    />
                    <span className={styles.optionName}>{country.name}</span>
                    <span className={styles.optionCode}>{country.dialCode}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </>
  );
}
