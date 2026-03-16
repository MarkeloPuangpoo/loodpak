/**
 * Derangement Shuffle Algorithm
 * 
 * Ensures that no player receives the word they submitted themselves.
 * Uses a derangement algorithm to guarantee no fixed points in the permutation.
 */

type PlayerWithWord = {
  id: string;
  submitted_word: string;
};

type PlayerWithAssignment = PlayerWithWord & {
  assigned_word: string;
};

/**
 * Checks if an array is a valid derangement (no element in its original position)
 */
function isValidDerangement(original: string[], shuffled: string[]): boolean {
  return original.every((word, index) => word !== shuffled[index]);
}

/**
 * Fisher-Yates shuffle algorithm
 */
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Generates a derangement using the "early refusal" algorithm
 * This is more efficient than pure random shuffling for small arrays
 */
function generateDerangement(items: string[]): string[] {
  const n = items.length;
  
  // Edge case: impossible to derange 1 item
  if (n === 1) {
    throw new Error("Cannot create derangement with only 1 item");
  }

  // Edge case: 2 items - just swap them
  if (n === 2) {
    return [items[1], items[0]];
  }

  // For larger arrays, use early refusal algorithm
  let attempts = 0;
  const maxAttempts = 1000; // Prevent infinite loops
  
  while (attempts < maxAttempts) {
    const shuffled = shuffle(items);
    
    if (isValidDerangement(items, shuffled)) {
      return shuffled;
    }
    
    attempts++;
  }

  // Fallback: use deterministic swap-based derangement
  return createDeterministicDerangement(items);
}

/**
 * Creates a deterministic derangement using a cyclic shift approach
 * Guaranteed to work for n >= 2
 */
function createDeterministicDerangement(items: string[]): string[] {
  const n = items.length;
  const result = new Array(n);
  
  // Simple cyclic shift: each item goes to next position
  for (let i = 0; i < n; i++) {
    result[i] = items[(i + 1) % n];
  }
  
  return result;
}

/**
 * Main function: Assigns forbidden words to players ensuring no one gets their own word
 * 
 * @param players - Array of players with their submitted words
 * @returns Array of players with assigned_word property added
 * @throws Error if derangement is impossible (e.g., only 1 player)
 */
export function assignForbiddenWords(
  players: PlayerWithWord[]
): PlayerWithAssignment[] {
  if (players.length === 0) {
    return [];
  }

  if (players.length === 1) {
    throw new Error(
      "Cannot assign forbidden words with only 1 player. Need at least 2 players."
    );
  }

  // Extract submitted words in order
  const submittedWords = players.map((p) => p.submitted_word);

  // Generate derangement
  const assignedWords = generateDerangement(submittedWords);

  // Map back to players with assigned words
  return players.map((player, index) => ({
    ...player,
    assigned_word: assignedWords[index],
  }));
}

/**
 * Validates that the assignment is correct (no player has their own word)
 */
export function validateAssignment(players: PlayerWithAssignment[]): boolean {
  return players.every(
    (player) => player.submitted_word !== player.assigned_word
  );
}
