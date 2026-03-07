import { Connected } from "base/Connected";
import { Props } from "base/Locals";
import { All } from "components/All";
import { Late } from "components/Late";
import { describe, expect, test } from "vitest";

describe("Locals.test", () => {
  test("test destroy Locals", async () => {
    const one$ = Late(1);
    const two$ = Late(2);

    const [lone$, ltwo$] = Props(one$, two$);
    const connected = Connected(lone$, ltwo$);

    expect(await All(connected, ltwo$)).toStrictEqual([1, 2]);

    connected.destroy();
    expect([one$.destroyed(), two$.destroyed()]).toStrictEqual([false, false]);
    expect([lone$.destroyed(), ltwo$.destroyed()]).toStrictEqual([true, true]);
  });
});
