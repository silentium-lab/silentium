import { Tap } from "base/Tap";
import { MessageType } from "types/MessageType";

/**
 * Helps represent an message as a primitive type, which can be useful
 * for cases when you need to always have a reference to the current value
 * without updating the shared value when the current one changes.
 * For example, this could be used when passing an authorization token.
 * It can also be useful for testing or logging purposes.
 */
export function Primitive<T>($base: MessageType<T>, theValue: T | null = null) {
  return new PrimitiveImpl<T>($base, theValue);
}

export class PrimitiveImpl<T> {
  private touched = false;

  public constructor(
    private $base: MessageType<T>,
    private theValue: T | null = null,
  ) {}

  private ensureTouched() {
    if (!this.touched) {
      this.$base.pipe(
        Tap((v) => {
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
