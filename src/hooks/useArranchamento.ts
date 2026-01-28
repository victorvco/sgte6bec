import { useState, useEffect } from "react";
import { ArranchamentoEntry } from "@/types/arranchamento";

const STORAGE_KEY = "arranchamento-entries";

export function useArranchamento() {
  const [entries, setEntries] = useState<ArranchamentoEntry[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setEntries(parsed);
      } catch (e) {
        console.error("Error parsing stored entries:", e);
      }
    }
  }, []);

  // Save to localStorage whenever entries change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entry: ArranchamentoEntry) => {
    setEntries((prev) => [...prev, entry]);
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  };

  const clearAll = () => {
    setEntries([]);
  };

  return {
    entries,
    addEntry,
    deleteEntry,
    clearAll,
  };
}
