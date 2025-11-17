import { MessageType } from "types/MessageType";
import { TapType } from "types/TapType";

/**
 * Creates an message from a Promise, allowing the promise's resolution or rejection
 * to be handled as an message. The resolved value is emitted to the tap,
 * and if an error is provided, rejections are forwarded to it.
 */
export function FromPromise<T>(p: Promise<T>, error?: TapType) {
  return new FromPromiseImpl<T>(p, error);
}

export class FromPromiseImpl<T> implements MessageType<T> {
  public constructor(
    private p: Promise<T>,
    private error?: TapType,
  ) {}

  public pipe(tap: TapType<T>): this {
    this.p
      .then((v) => {
        tap.use(v);
      })
      .catch((e) => {
        this.error?.use(e);
      });
    return this;
  }
}
