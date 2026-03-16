import { assignForbiddenWords, validateAssignment } from "../derangement";

describe("Derangement Algorithm", () => {
  test("should assign different words to each player", () => {
    const players = [
      { id: "1", submitted_word: "actually" },
      { id: "2", submitted_word: "literally" },
      { id: "3", submitted_word: "basically" },
    ];

    const result = assignForbiddenWords(players);

    // Each player should have an assigned word
    expect(result).toHaveLength(3);
    result.forEach((player) => {
      expect(player.assigned_word).toBeDefined();
    });
  });

  test("should ensure no player gets their own word", () => {
    const players = [
      { id: "1", submitted_word: "actually" },
      { id: "2", submitted_word: "literally" },
      { id: "3", submitted_word: "basically" },
      { id: "4", submitted_word: "honestly" },
    ];

    const result = assignForbiddenWords(players);

    // Validate that no player has their own word
    expect(validateAssignment(result)).toBe(true);

    result.forEach((player) => {
      expect(player.assigned_word).not.toBe(player.submitted_word);
    });
  });

  test("should work with 2 players (minimum)", () => {
    const players = [
      { id: "1", submitted_word: "hello" },
      { id: "2", submitted_word: "world" },
    ];

    const result = assignForbiddenWords(players);

    expect(result[0].assigned_word).toBe("world");
    expect(result[1].assigned_word).toBe("hello");
    expect(validateAssignment(result)).toBe(true);
  });

  test("should throw error with only 1 player", () => {
    const players = [{ id: "1", submitted_word: "alone" }];

    expect(() => assignForbiddenWords(players)).toThrow(
      "Cannot assign forbidden words with only 1 player"
    );
  });

  test("should handle empty array", () => {
    const players: Array<{ id: string; submitted_word: string }> = [];

    const result = assignForbiddenWords(players);

    expect(result).toEqual([]);
  });

  test("should create valid derangement for large groups", () => {
    const players = Array.from({ length: 10 }, (_, i) => ({
      id: `player-${i}`,
      submitted_word: `word-${i}`,
    }));

    const result = assignForbiddenWords(players);

    expect(result).toHaveLength(10);
    expect(validateAssignment(result)).toBe(true);

    // Verify no player has their own word
    result.forEach((player, index) => {
      expect(player.assigned_word).not.toBe(`word-${index}`);
    });
  });

  test("should maintain all words in the pool", () => {
    const players = [
      { id: "1", submitted_word: "cat" },
      { id: "2", submitted_word: "dog" },
      { id: "3", submitted_word: "bird" },
    ];

    const result = assignForbiddenWords(players);

    const submittedWords = players.map((p) => p.submitted_word).sort();
    const assignedWords = result.map((p) => p.assigned_word).sort();

    // All submitted words should appear exactly once as assigned words
    expect(assignedWords).toEqual(submittedWords);
  });

  test("should be deterministic for 2 players", () => {
    const players = [
      { id: "1", submitted_word: "alpha" },
      { id: "2", submitted_word: "beta" },
    ];

    // Run multiple times to ensure consistency
    for (let i = 0; i < 5; i++) {
      const result = assignForbiddenWords(players);
      expect(result[0].assigned_word).toBe("beta");
      expect(result[1].assigned_word).toBe("alpha");
    }
  });

  test("should handle duplicate words correctly", () => {
    const players = [
      { id: "1", submitted_word: "same" },
      { id: "2", submitted_word: "same" },
      { id: "3", submitted_word: "different" },
    ];

    const result = assignForbiddenWords(players);

    // Even with duplicates, no player should get their exact position's word
    expect(validateAssignment(result)).toBe(true);
  });
});
