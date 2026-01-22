import { Actual } from "base/Actual";
import { Computed } from "components/Computed";
import { MaybeMessage } from "types/MessageType";

/**
 * Reduces values of message data to one common value
 */
export function Fold<T extends any[], TG>(
  data: MaybeMessage<T>,
  reducer: (acc: TG, item: T[number], index: number) => TG,
  initial: MaybeMessage<TG>,
) {
  const $data = Actual(data);
  const $initial = Actual(initial);
  return Computed(
    (data, initial) => data.reduce(reducer, initial),
    $data,
    $initial,
  );
}
