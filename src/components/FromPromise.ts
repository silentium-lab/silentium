import { MessageType } from "types/MessageType";
import { TransportType } from "types/TransportType";

/**
 * Creates an message from a Promise, allowing the promise's resolution or rejection
 * to be handled as an message. The resolved value is emitted to the transport,
 * and if an error is provided, rejections are forwarded to it.
 */
export function FromPromise<T>(p: Promise<T>, error?: TransportType) {
  return new FromPromiseImpl<T>(p, error);
}

export class FromPromiseImpl<T> implements MessageType<T> {
  public constructor(
    private p: Promise<T>,
    private error?: TransportType,
  ) {}

  public to(transport: TransportType<T>): this {
    this.p
      .then((v) => {
        transport.use(v);
      })
      .catch((e) => {
        this.error?.use(e);
      });
    return this;
  }
}
