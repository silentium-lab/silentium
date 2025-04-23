import { GuestExecutorType, GuestObjectType, GuestType } from "../Guest/Guest";
import {
  guestExecutorApplied,
  GuestExecutorApplied,
} from "../Guest/GuestExecutorApplied";

/**
 * @url https://silentium-lab.github.io/silentium/#/patron/patron-executor-applied
 */
export class PatronExecutorApplied<T> implements GuestObjectType<T> {
  private guestApplied: GuestExecutorApplied<T>;

  public constructor(
    baseGuest: GuestType<T>,
    applier: (executor: GuestExecutorType) => GuestExecutorType,
  ) {
    this.guestApplied = guestExecutorApplied(baseGuest, applier);
  }

  public give(value: T): this {
    this.guestApplied.give(value);
    return this;
  }

  public introduction(): "guest" | "patron" {
    return "patron";
  }
}
