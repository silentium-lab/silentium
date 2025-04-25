import { expect, test, vitest } from "vitest";
import { guestSync } from "../Guest/GuestSync";
import { patron } from "../Patron/Patron";
import { value } from "../Source/Source";
import { sourceAll } from "./SourceAll";
import { sourceOf } from "./SourceChangeable";

test("SourceAll._asArray.test", () => {
  const one = sourceOf<number>(1);
  const two = sourceOf<number>(2);
  const all = sourceAll([one.value, two.value]);

  const guest = vitest.fn();
  value(
    all,
    patron((value) => {
      guest(JSON.stringify(value));
    }),
  );

  const gs = guestSync<[number, number]>();
  value(all, gs);

  expect(guest).toBeCalledWith("[1,2]");
});
