import { describe, expect, test } from "vitest";
import { Piped } from "components/Piped";
import { Of } from "base/Of";
import { Message } from "base/Message";
import { Applied } from "components/Applied";

describe("Piped.test", () => {
  test("basic pipe with single constructor", async () => {
    const $base = Of(10);
    const double = ($msg: MessageType<number>) =>
      Applied($msg, (v: number) => v * 2);

    const $result = Piped($base, double);
    const result = await $result;

    expect(result).toBe(20);
  });

  test("pipe with multiple constructors", async () => {
    const $base = Of(5);
    const addTwo = ($msg: MessageType<number>) =>
      Applied($msg, (v: number) => v + 2);
    const multiplyThree = ($msg: MessageType<number>) =>
      Applied($msg, (v: number) => v * 3);
    const subtractOne = ($msg: MessageType<number>) =>
      Applied($msg, (v: number) => v - 1);

    const $result = Piped($base, addTwo, multiplyThree, subtractOne);
    const result = await $result;

    expect(result).toBe((5 + 2) * 3 - 1); // 7 * 3 - 1 = 20
  });

  test("pipe with raw value instead of message", async () => {
    const rawValue = 10;
    const double = ($msg: MessageType<number>) =>
      Applied($msg, (v: number) => v * 2);

    const $result = Piped(rawValue, double);
    const result = await $result;

    expect(result).toBe(20);
  });

  test("pipe with mixed raw value and message", async () => {
    const rawValue = 5;
    const addTwo = ($msg: MessageType<number>) =>
      Applied($msg, (v: number) => v + 2);
    const multiplyThree = ($msg: MessageType<number>) =>
      Applied($msg, (v: number) => v * 3);

    const $result = Piped(rawValue, addTwo, multiplyThree);
    const result = await $result;

    expect(result).toBe((5 + 2) * 3); // 21
  });

  test("pipe with string transformations", async () => {
    const $base = Of("hello");
    const toUpperCase = ($msg: MessageType<string>) =>
      Applied($msg, (v: string) => v.toUpperCase());
    const addExclamation = ($msg: MessageType<string>) =>
      Applied($msg, (v: string) => v + "!");

    const $result = Piped($base, toUpperCase, addExclamation);
    const result = await $result;

    expect(result).toBe("HELLO!");
  });

  test("pipe with object transformations", async () => {
    const $base = Of({ name: "John", age: 30 });
    const addCountry = ($msg: MessageType<{ name: string; age: number }>) =>
      Applied($msg, (v) => ({ ...v, country: "USA" }));
    const incrementAge = (
      $msg: MessageType<{ name: string; age: number; country: string }>,
    ) => Applied($msg, (v) => ({ ...v, age: v.age + 1 }));

    const $result = Piped($base, addCountry, incrementAge);
    const result = await $result;

    expect(result).toEqual({ name: "John", age: 31, country: "USA" });
  });

  test("pipe with error handling in constructor", () => {
    const $base = Of(10);
    const errorConstructor = ($msg: MessageType<number>) =>
      Message<number>((resolve, reject) => {
        $msg.then(() => reject("error from constructor"));
      });

    const $result = Piped($base, errorConstructor);

    let caught = false;
    $result.then(() => {
      throw new Error("should not resolve");
    });
    $result.catch((e: unknown) => {
      expect(e).toBe("error from constructor");
      caught = true;
    });

    expect(caught).toBe(true);
  });

  test("pipe with no constructors returns original message", () => {
    const $base = Of(42);

    const $result = Piped($base) as any;

    const g = vi.fn();
    $result.then(g);

    expect(g).toBeCalledWith(42);
  });

  test("pipe with raw value and no constructors", async () => {
    const rawValue = 42;

    const $result = Piped(rawValue) as any;

    // When no constructors are provided, Pipe returns the raw value directly
    expect(await $result).toBe(42);
  });

  test("pipe with complex type transformations", async () => {
    const $base = Of([1, 2, 3]);
    const sumArray = ($msg: MessageType<number[]>) =>
      Applied($msg, (v: number[]) => v.reduce((a, b) => a + b, 0));
    const doubleSum = ($msg: MessageType<number>) =>
      Applied($msg, (v: number) => v * 2);
    const toString = ($msg: MessageType<number>) =>
      Applied($msg, (v: number) => `Sum: ${v}`);

    const $result = Piped($base, sumArray, doubleSum, toString);
    const result = await $result;

    expect(result).toBe("Sum: 12"); // (1+2+3)*2 = 12
  });

  test("pipe preserves message chainability", () => {
    const $base = Of(10);
    const addFive = ($msg: MessageType<number>) =>
      Applied($msg, (v: number) => v + 5);

    const $result = Piped($base, addFive) as any;

    // Should be able to chain then/catch
    let resolved = false;
    let rejected = false;

    $result.then((v: number) => {
      expect(v).toBe(15);
      resolved = true;
    });

    $result.catch(() => {
      rejected = true;
    });

    expect(resolved).toBe(true);
    expect(rejected).toBe(false);
  });
});

import { MessageType } from "types/MessageType";
import { vi } from "vitest";
