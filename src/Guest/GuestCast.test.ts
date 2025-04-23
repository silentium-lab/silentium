import { expect, test } from "vitest";
import { patron } from "../Patron/Patron";
import { sourceChangeable } from "../Source/SourceChangeable";
import { give, guest } from "./Guest";
import { guestCast } from "./GuestCast";

test("GuestCast.test", () => {
  const source = sourceChangeable();
  let acc = 0;
  const mainGuest = patron(
    guest((value: number) => {
      acc += value;
    }),
  );

  // Становится патроном тоже, тк наследует это свойство от mainGuest
  const secondGuest = guestCast(
    mainGuest,
    guest((value: number) => {
      acc += value;
    }),
  );

  source.value(mainGuest);
  source.value(secondGuest);

  give(2, source);

  expect(acc).toBe(4);
});
