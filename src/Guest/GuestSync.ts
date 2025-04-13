import { GuestObjectType } from "./Guest";

export interface GuestValueType<T = any> extends GuestObjectType<T> {
  value(): T;
}

/**
 * @url https://silentium-lab.github.io/silentium/#/guest/guest-sync
 */
export class GuestSync<T> implements GuestValueType<T> {
  public constructor(private theValue?: T) {}

  public give(value: T): this {
    this.theValue = value;
    return this;
  }

  public value() {
    if (!this.theValue) {
      throw new Error("no value in GuestSync!");
    }
    return this.theValue;
  }
}
