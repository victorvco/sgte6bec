import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArranchamentoEntry } from "@/types/arranchamento";
import { toast } from "@/hooks/use-toast";

export function useArranchamento() {
  const [entries, setEntries] = useState<ArranchamentoEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch entries from database
  const fetchEntries = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("arranchamento_entries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching entries:", error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os registros.",
          variant: "destructive",
        });
        return;
      }

      setEntries(data || []);
    } catch (e) {
      console.error("Error fetching entries:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load entries on mount
  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("arranchamento-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "arranchamento_entries",
        },
        () => {
          // Refetch on any change
          fetchEntries();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchEntries]);

  const addEntry = async (entry: Omit<ArranchamentoEntry, "id" | "created_at">) => {
    try {
      const { error } = await supabase
        .from("arranchamento_entries")
        .insert([entry]);

      if (error) {
        console.error("Error adding entry:", error);
        toast({
          title: "Erro ao salvar",
          description: "Não foi possível salvar o registro.",
          variant: "destructive",
        });
        return false;
      }

      return true;
    } catch (e) {
      console.error("Error adding entry:", e);
      return false;
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from("arranchamento_entries")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error deleting entry:", error);
        toast({
          title: "Erro ao excluir",
          description: "Não foi possível excluir o registro.",
          variant: "destructive",
        });
        return;
      }
    } catch (e) {
      console.error("Error deleting entry:", e);
    }
  };

  const clearAll = async () => {
    try {
      const { error } = await supabase
        .from("arranchamento_entries")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Delete all

      if (error) {
        console.error("Error clearing entries:", error);
        toast({
          title: "Erro ao limpar",
          description: "Não foi possível limpar os registros.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Registros excluídos",
        description: "Todos os registros foram removidos.",
      });
    } catch (e) {
      console.error("Error clearing entries:", e);
    }
  };

  return {
    entries,
    loading,
    addEntry,
    deleteEntry,
    clearAll,
    refetch: fetchEntries,
  };
}
