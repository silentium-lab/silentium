import { GuestObjectType, GuestType } from "../Guest/Guest";
import { GuestApplied } from "../Guest/GuestApplied";

/**
 * @url https://silentium-lab.github.io/silentium/#/patron/patron-applied
 */
export class PatronApplied<T, R> implements GuestObjectType<T> {
  private guestApplied: GuestApplied<T, R>;

  public constructor(baseGuest: GuestType<R>, applier: (value: T) => R) {
    this.guestApplied = new GuestApplied(baseGuest, applier);
  }

  public give(value: T): this {
    this.guestApplied.give(value);
    return this;
  }

  public introduction(): "guest" | "patron" {
    return "patron";
  }
}
