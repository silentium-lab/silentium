import { value } from "../Source/Source";
import { expect, test, vitest } from "vitest";
import { Patron } from "../Patron/Patron";
import { sourceAll } from "./SourceAll";
import { SourceChangeable } from "./SourceChangeable";
import { GuestSync } from "../Guest/GuestSync";

test("SourceAll._asArray.test", () => {
  const one = new SourceChangeable(1);
  const two = new SourceChangeable(2);
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
