import { User } from "../base";
import { EventType } from "../types";

export class Primitive<T> {
  private touched = false;

  public constructor(
    private $base: EventType<T>,
    private theValue: T | null = null,
  ) {}

  private ensureTouched() {
    if (!this.touched) {
      this.$base.event(
        new User((v) => {
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
