import { Source } from "base/Source";
import { Late } from "components/Late";
import { Diagram } from "testing/Diagram";
import { describe, expect, test } from "vitest";

describe("Source.test", () => {
  test("message source as proxy", async () => {
    const $l = Late(1);
    const $proxy = Source<number>(
      (r) => {
        $l.then(r);
      },
      (v) => {
        $l.use(v);
      },
    );

    const v1 = await $proxy;
    expect(v1).toBe(1);

    $l.use(42);

    const v2 = await $proxy;
    expect(v2).toBe(42);
  });

  test("duplicate value", () => {
    const d = Diagram();
    const $l = Late(1);
    const $proxy = Source<number>(
      (r) => {
        $l.then(r);
      },
      (v) => {
        $l.use(v);
      },
    );
    $proxy.then(d.resolver);
    $proxy.use(2);
    $proxy.use(2);
    $proxy.use(2);

    expect(d.toString()).toBe("1|2");

    $proxy.use(3);
    expect(d.toString()).toBe("1|2|3");
  });
});
