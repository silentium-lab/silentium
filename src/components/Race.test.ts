import { describe, expect, test } from "vitest";
import { Of } from "base/Of";
import { Race } from "components/Race";
import { Late } from "components/Late";

describe("Race.test", () => {
  test("returns first resolved message", async () => {
    const fast = Of(1);
    const slow = new Promise((resolve) => setTimeout(() => resolve(2), 100));

    const race = Race(fast, slow);

    const result = await race;
    expect(result).toBe(1);
  });

  test("returns first resolved message with raw values", async () => {
    const race = Race(1, 2, 3);

    const result = await race;
    expect(result).toBe(1);
  });

  test("handles mixed messages and raw values", async () => {
    const message = Of("message");
    const race = Race(message, 2, 3);

    const result = await race;
    expect(result).toBe("message");
  });

  test("handles late values that resolve first", async () => {
    const late = Late<number>();
    const slow = new Promise((resolve) => setTimeout(() => resolve(2), 100));

    const race = Race(late, slow);

    // Set up listener before resolving late
    const promise = race.then((result) => result);

    // Resolve late value
    late.use(42);

    const result = await promise;
    expect(result).toBe(42);
  });

  test("handles late values that resolve second", async () => {
    const late = Late<number>();
    const fast = Of(1);

    const race = Race(fast, late);

    // Resolve late value after fast message
    late.use(42);

    const result = await race;
    expect(result).toBe(1);
  });

  test("handles rejection properly", async () => {
    const rejecting = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("test error")), 50),
    );
    const fast = Of(1);

    const race = Race(fast, rejecting);

    const result = await race;
    expect(result).toBe(1);
  });

  test("does not reject when all messages reject (race behavior)", async () => {
    const rejecting1 = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("error1")), 50),
    );
    const rejecting2 = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("error2")), 100),
    );

    const race = Race(rejecting1, rejecting2);

    // Race doesn't reject when all messages reject - it just never resolves
    // This is expected behavior for race conditions
    let resolved = false;
    race
      .then(() => {
        resolved = true;
      })
      .catch(() => {
        // Should not be called
      });

    // Wait a bit to see if it resolves or rejects
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(resolved).toBe(false);
  });

  test("handles empty race (never resolves)", async () => {
    const race = Race();

    // Empty race never resolves or rejects
    let resolved = false;
    race
      .then(() => {
        resolved = true;
      })
      .catch(() => {
        // Should not be called
      });

    // Wait a bit to see if it resolves or rejects
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(resolved).toBe(false);
  });

  test("handles single message", async () => {
    const single = Of(42);
    const race = Race(single);

    const result = await race;
    expect(result).toBe(42);
  });

  test("handles single raw value", async () => {
    const race = Race(42);

    const result = await race;
    expect(result).toBe(42);
  });
});
