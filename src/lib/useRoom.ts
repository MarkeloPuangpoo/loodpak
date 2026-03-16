"use client";

import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

type PlayerRow = {
  id: string;
  room_id: string;
  name: string;
  submitted_word: string | null;
  assigned_word: string | null;
  is_eliminated: boolean;
  created_at: string;
};

export type RoomPlayer = {
  id: string;
  roomId: string;
  name: string;
  submittedWord: string | null;
  assignedWord: string | null;
  isEliminated: boolean;
  createdAt: string;
};

export function useRoom(roomId: string | undefined) {
  const [players, setPlayers] = useState<RoomPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;

    let channel: ReturnType<typeof supabase.channel> | null = null;

    const loadPlayers = async () => {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("players")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (fetchError) {
        setError(fetchError.message);
        setLoading(false);
        return;
      }

      setPlayers(
        (data || []).map((row) => ({
          id: row.id,
          roomId: row.room_id,
          name: row.name,
          submittedWord: row.submitted_word,
          assignedWord: row.assigned_word,
          isEliminated: row.is_eliminated,
          createdAt: row.created_at,
        }))
      );
      setLoading(false);
    };

    loadPlayers();

    channel = supabase
      .channel(`room_players_${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          const newRecord = payload.new as PlayerRow | null;
          const oldRecord = payload.old as PlayerRow | null;

          if (payload.eventType === "INSERT" && newRecord) {
            setPlayers((prev) => [
              ...prev,
              {
                id: newRecord.id,
                roomId: newRecord.room_id,
                name: newRecord.name,
                submittedWord: newRecord.submitted_word,
                assignedWord: newRecord.assigned_word,
                isEliminated: newRecord.is_eliminated,
                createdAt: newRecord.created_at,
              },
            ]);
          } else if (payload.eventType === "UPDATE" && newRecord) {
            setPlayers((prev) =>
              prev.map((p) =>
                p.id === newRecord.id
                  ? {
                      id: newRecord.id,
                      roomId: newRecord.room_id,
                      name: newRecord.name,
                      submittedWord: newRecord.submitted_word,
                      assignedWord: newRecord.assigned_word,
                      isEliminated: newRecord.is_eliminated,
                      createdAt: newRecord.created_at,
                    }
                  : p
              )
            );
          } else if (payload.eventType === "DELETE" && oldRecord) {
            setPlayers((prev) => prev.filter((p) => p.id !== oldRecord.id));
          }
        }
      )
      .subscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [roomId]);

  return { players, setPlayers, loading, error };
}
