import { EventType } from "../types/EventType";
import { TransportType } from "../types/TransportType";

/**
 * Creates an event from a Promise, allowing the promise's resolution or rejection
 * to be handled as an event. The resolved value is emitted to the transport,
 * and if an error is provided, rejections are forwarded to it.
 */
export function FromPromise<T>(p: Promise<T>, error?: TransportType) {
  return new FromPromiseEvent<T>(p, error);
}

export class FromPromiseEvent<T> implements EventType<T> {
  public constructor(
    private p: Promise<T>,
    private error?: TransportType,
  ) {}

  public event(transport: TransportType<T>): this {
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
