import { describe, expect, test, vi } from "vitest";
import { Of } from "base/Of";
import { All } from "components/All";
import { Late } from "components/Late";

describe("All.test", () => {
  test("combined result from many messages", () => {
    const a = All(Of(1), Of(2));

    const o = vi.fn();
    a.then(o);

    expect(o).toBeCalledWith([1, 2]);
  });

  test("combined result from many raw values", () => {
    const a = All(1, 2, 3);

    const o = vi.fn();
    a.then(o);

    expect(o).toBeCalledWith([1, 2, 3]);
  });

  test("with changed model", async () => {
    const l = Late(1);
    const $a = All(l, 2, 3);
    $a.catch((v) => {
      console.log(v);
    });
    expect(await $a).toStrictEqual([1, 2, 3]);
    expect(await $a).toStrictEqual([1, 2, 3]);

    l.use(21);
    expect(await $a).toStrictEqual([21, 2, 3]);
  });
});
