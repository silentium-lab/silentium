import { expect, test, vitest } from "vitest";
import { source, value } from "./Source";

test("Source.test", () => {
  const aware = source(111);

  const guest = vitest.fn();
  value(aware, guest);

  expect(guest).toBeCalledWith(111);
});
