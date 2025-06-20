import { expect, test, vitest } from "vitest";
import { guestSync } from "../Guest/GuestSync";
import { patron } from "../Guest/Patron";
import { value } from "../Source/Source";
import { sourceAll } from "./SourceAll";
import { sourceOf } from "./SourceChangeable";
import { sourceSync } from "../Source/SourceSync";
import { destroy, patronPoolsStatistic } from "../Guest/PatronPool";

test("SourceAll._asArray.test", () => {
  const statistic: any = sourceSync(patronPoolsStatistic);
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

  destroy(one, two, all, statistic);
  expect(statistic.syncValue().patronsCount).toBe(0);
  expect(statistic.syncValue().poolsCount).toBe(0);
});
