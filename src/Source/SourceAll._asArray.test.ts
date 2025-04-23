import { expect, test, vitest } from "vitest";
import { guestSync } from "../Guest/GuestSync";
import { patron } from "../Patron/Patron";
import { value } from "../Source/Source";
import { sourceAll } from "./SourceAll";
import { sourceChangeable } from "./SourceChangeable";

test("SourceAll._asArray.test", () => {
  const one = sourceChangeable<number>(1);
  const two = sourceChangeable<number>(2);
  const all = sourceAll<[number, number]>([one, two]);

  const guest = vitest.fn();
  value(
    all,
    patron((value) => {
      guest(JSON.stringify(value));
    }),
  );

  const gs = guestSync();
  value(all, gs);

  expect(guest).toBeCalledWith("[1,2]");
});
