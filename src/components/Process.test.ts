import { describe, expect, test } from "vitest";
import { Message } from "base/Message";
import { Process } from "components/Process";
import { Late } from "components/Late";
import { Diagram } from "testing/Diagram";
import { Of } from "base/Of";

describe("Process.test", () => {
  test("basic process", async () => {
    const $base = Of(10); // resolves to 10
    const builder = (v: number) => Of(v * 2); // returns Message that resolves to v*2

    const $proc = Process($base, builder);
    const result = await $proc;
    expect(result).toBe(20);
  });

  test("process with late shared", () => {
    const d = Diagram();
    const $base = Late<number>();
    const builder = (v: number) =>
      Message<number>((resolve) => {
        resolve(v + 1);
        return () => d.resolver(`destroy_${v}`);
      });

    const $proc = Process($base, builder);

    $proc.then((v) => d.resolver(`proc_${v}`));

    $base.use(5);

    expect(d.toString()).toBe("proc_6");

    $proc.destroy();

    expect(d.toString()).toBe("proc_6|destroy_5");
  });

  test("error handling from built message", () => {
    const $base = Of(10);
    const builder = () =>
      Message<number>((resolve, reject) => {
        reject("error from builder");
      });

    const $proc = Process($base, builder);

    let caught = false;
    $proc.then(() => {
      throw new Error("should not resolve");
    });
    $proc.catch((e) => {
      expect(e).toBe("error from builder");
      caught = true;
    });

    expect(caught).toBe(true);
  });

  test("error handling from base", () => {
    const $base = Message<string>((resolve, reject) => {
      reject("base error");
    });
    const builder = (v: string) => Of(`processed_${v}`);

    const $proc = Process($base, builder);

    let caught = false;
    $proc.then(() => {
      throw new Error("should not resolve");
    });
    $proc.catch((e) => {
      expect(e).toBe("base error");
      caught = true;
    });

    expect(caught).toBe(true);
  });

  test("chaining multiple processes", async () => {
    const $base = Of(1);

    // Process 1: add 2
    const $proc1 = Process($base, (v: number) => Of(v + 2));

    // Process 2: multiply by 3
    const $proc2 = Process($proc1, (v: number) => Of(v * 3));

    const result = await $proc2;
    expect(result).toBe(9); // (1+2)*3
  });

  test("destruction calls destroy on created messages", () => {
    let isDestroyed = false;
    const $base = Late<number>();
    const builder = (v: number) =>
      Message<number>((resolve) => {
        resolve(v * 2);
        return () => {
          isDestroyed = true;
        };
      });

    const $proc = Process($base, builder);

    $base.use(5); // Triggers creation if listened
    $proc.then(() => {}); // Trigger the executor, add to dc
    expect(isDestroyed).toBe(false);

    $proc.destroy();
    expect(isDestroyed).toBe(true);
  });
});
