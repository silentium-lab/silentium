import { Source } from "base/MessageSource";
import { Late } from "components/Late";
import { describe, expect, test } from "vitest";

describe("MessageSource.test", () => {
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
});
