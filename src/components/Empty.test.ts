import { Of } from "base/Of";
import { Void } from "base/Void";
import { Catch } from "components/Catch";
import { Default } from "components/Default";
import { Empty } from "components/Empty";
import { Late } from "components/Late";
import { describe, expect, test } from "vitest";

describe("Empty.test", () => {
  test("With late", async () => {
    const l = Late();
    const d = Default(Empty(l), "none");

    expect(await d).toBe("none");

    l.use("valued");

    expect(await d).toBe("valued");
  });

  test("With catch", async () => {
    const m = Empty(Of(undefined));
    const c = Catch(m);
    m.then(Void());
    expect(await c).toBe("Empty: no value in base message!");
  });

  test("With after argument", async () => {
    const base = Late<string>();
    const after = Of("trigger");
    const m = Empty(base, after);
    const c = Catch(m);
    m.then(Void());
    expect(await c).toBe("Empty: no value after message!");
  });
});
