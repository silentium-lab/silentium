import { Transport } from "../base";
import { EventType } from "../types";

/**
 * Helps represent an event as a primitive type, which can be useful
 * for cases when you need to always have a reference to the current value
 * without updating the shared value when the current one changes.
 * For example, this could be used when passing an authorization token.
 * It can also be useful for testing or logging purposes.
 */
export function Primitive<T>($base: EventType<T>, theValue: T | null = null) {
  return new ThePrimitive<T>($base, theValue);
}

class ThePrimitive<T> {
  private touched = false;

  public constructor(
    private $base: EventType<T>,
    private theValue: T | null = null,
  ) {}

  private ensureTouched() {
    if (!this.touched) {
      this.$base.event(
        Transport((v) => {
          this.theValue = v;
        }),
      );
    }
    this.touched = true;
  }

  public [Symbol.toPrimitive]() {
    this.ensureTouched();
    return this.theValue;
  }

  public primitive() {
    this.ensureTouched();
    return this.theValue;
  }

  public primitiveWithException() {
    this.ensureTouched();
    if (this.theValue === null) {
      throw new Error("Primitive value is null");
    }
    return this.theValue;
  }
}
