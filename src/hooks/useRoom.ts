import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { RealtimeChannel } from "@supabase/supabase-js";

export type Player = {
  id: string;
  room_id: string;
  name: string;
  submitted_word: string | null;
  assigned_word: string | null;
  is_eliminated: boolean;
  created_at: string;
};

export type Room = {
  id: string;
  code: string;
  status: "lobby" | "drafting" | "playing" | "finished";
  created_at: string;
};

export function useRoom(roomCode: string) {
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoom = useCallback(async () => {
    try {
      const { data: roomData, error: roomError } = await supabase
        .from("rooms")
        .select("*")
        .eq("code", roomCode)
        .single();

      if (roomError) throw roomError;
      setRoom(roomData);
      return roomData;
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  }, [roomCode]);

  const fetchPlayers = useCallback(async (roomId: string) => {
    try {
      const { data, error: playersError } = await supabase
        .from("players")
        .select("*")
        .eq("room_id", roomId)
        .order("created_at", { ascending: true });

      if (playersError) throw playersError;
      setPlayers(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    let channel: RealtimeChannel | null = null;

    const initialize = async () => {
      setLoading(true);
      const roomData = await fetchRoom();
      
      if (roomData) {
        await fetchPlayers(roomData.id);

        channel = supabase
          .channel(`room:${roomData.id}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "players",
              filter: `room_id=eq.${roomData.id}`,
            },
            (payload) => {
              if (payload.eventType === "INSERT") {
                setPlayers((prev) => [...prev, payload.new as Player]);
              } else if (payload.eventType === "UPDATE") {
                setPlayers((prev) =>
                  prev.map((p) =>
                    p.id === payload.new.id ? (payload.new as Player) : p
                  )
                );
              } else if (payload.eventType === "DELETE") {
                setPlayers((prev) =>
                  prev.filter((p) => p.id !== payload.old.id)
                );
              }
            }
          )
          .on(
            "postgres_changes",
            {
              event: "UPDATE",
              schema: "public",
              table: "rooms",
              filter: `id=eq.${roomData.id}`,
            },
            (payload) => {
              setRoom(payload.new as Room);
            }
          )
          .subscribe();
      }

      setLoading(false);
    };

    initialize();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [roomCode, fetchRoom, fetchPlayers]);

  const updateRoomStatus = useCallback(
    async (status: Room["status"]) => {
      if (!room) return;

      const { error } = await supabase
        .from("rooms")
        .update({ status })
        .eq("id", room.id);

      if (error) {
        setError(error.message);
      }
    },
    [room]
  );

  const eliminatePlayer = useCallback(async (playerId: string) => {
    const { error } = await supabase
      .from("players")
      .update({ is_eliminated: true })
      .eq("id", playerId);

    if (error) {
      setError(error.message);
    }
  }, []);

  const submitWord = useCallback(async (playerId: string, word: string) => {
    const { error } = await supabase
      .from("players")
      .update({ submitted_word: word })
      .eq("id", playerId);

    if (error) {
      setError(error.message);
    }
  }, []);

  const assignWords = useCallback(async () => {
    if (!room) return;

    try {
      const { assignWordsToPlayers } = await import("@/lib/roomActions");
      await assignWordsToPlayers(room.id);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }, [room]);

  return {
    room,
    players,
    loading,
    error,
    updateRoomStatus,
    eliminatePlayer,
    submitWord,
    assignWords,
    refreshPlayers: () => room && fetchPlayers(room.id),
  };
}
