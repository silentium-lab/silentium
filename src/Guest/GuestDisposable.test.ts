import { expect, test, vitest } from "vitest";
import { patron } from "../Patron/Patron";
import { sourceOf } from "../Source/SourceChangeable";
import { guestDisposable } from "./GuestDisposable";

test("GuestDisposable.test", () => {
  const source = sourceOf<number>(1);

  const guest = vitest.fn();

  // Работает проверка один раз, потом патрон себя удаляет
  source.value(
    patron(
      guestDisposable(guest, (value) => {
        return value !== null && value > 1;
      }),
    ),
  );

  // Эти выражения не вызывают expect
  source.give(2);
  source.give(3);

  expect(guest).toBeCalledTimes(1);
  expect(guest).toBeCalledWith(1);
});
