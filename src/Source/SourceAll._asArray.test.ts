import { expect, test, vitest } from "vitest";
import { GuestSync } from "../Guest/GuestSync";
import { Patron } from "../Patron/Patron";
import { value } from "../Source/Source";
import { sourceAll } from "./SourceAll";
import { sourceChangeable } from "./SourceChangeable";

test("SourceAll._asArray.test", () => {
  const one = sourceChangeable(1);
  const two = sourceChangeable(2);
  const all = sourceAll<[number, number]>([one, two]);

  const guest = vitest.fn();
  value(
    all,
    new Patron((value) => {
      guest(JSON.stringify(value));
    }),
  );

  const gs = new GuestSync();
  value(all, gs);

  expect(guest).toBeCalledWith("[1,2]");
});
