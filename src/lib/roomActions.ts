import { supabase } from "./supabaseClient";
import { assignForbiddenWords } from "./derangement";

export async function createRoom(code: string) {
  const roomId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  
  const { data, error } = await supabase
    .from("rooms")
    .insert({
      id: roomId,
      code: code,
      status: "lobby",
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create room: ${error.message}`);
  }

  return data;
}

export async function joinRoom(roomCode: string, playerName: string) {
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .select("*")
    .eq("code", roomCode)
    .single();

  if (roomError) {
    throw new Error(`Room not found: ${roomError.message}`);
  }

  const playerId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

  const { data: player, error: playerError } = await supabase
    .from("players")
    .insert({
      id: playerId,
      room_id: room.id,
      name: playerName,
    })
    .select()
    .single();

  if (playerError) {
    throw new Error(`Failed to join room: ${playerError.message}`);
  }

  return { room, player };
}

export async function getRoomByCode(code: string) {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("code", code)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function getPlayersInRoom(roomId: string) {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch players: ${error.message}`);
  }

  return data || [];
}

export async function assignWordsToPlayers(roomId: string) {
  // Fetch all players in the room
  const { data: players, error: fetchError } = await supabase
    .from("players")
    .select("*")
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  if (fetchError) {
    throw new Error(`Failed to fetch players: ${fetchError.message}`);
  }

  if (!players || players.length < 2) {
    throw new Error("Need at least 2 players to assign words");
  }

  // Check if all players have submitted words
  const allSubmitted = players.every((p) => p.submitted_word);
  if (!allSubmitted) {
    throw new Error("Not all players have submitted their words yet");
  }

  // Use derangement algorithm to assign words
  const playersWithWords = players.map((p) => ({
    id: p.id,
    submitted_word: p.submitted_word!,
  }));

  const assignments = assignForbiddenWords(playersWithWords);

  // Update each player with their assigned word
  const updatePromises = assignments.map((assignment) =>
    supabase
      .from("players")
      .update({ assigned_word: assignment.assigned_word })
      .eq("id", assignment.id)
  );

  const results = await Promise.all(updatePromises);

  // Check for errors
  const errors = results.filter((r) => r.error);
  if (errors.length > 0) {
    throw new Error(
      `Failed to assign words to some players: ${errors[0].error?.message}`
    );
  }

  return assignments;
}
