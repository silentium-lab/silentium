import { EventType, TransportType } from "../types";

/**
 * Promise event
 */
export function FromPromise<T>(p: Promise<T>, errorOwner?: TransportType) {
  return new TheFromPromise<T>(p, errorOwner);
}

export class TheFromPromise<T> implements EventType<T> {
  public constructor(
    private p: Promise<T>,
    private errorOwner?: TransportType,
  ) {}

  public event(transport: TransportType<T>): this {
    this.p
      .then(function FromPromiseThen(v) {
        transport.use(v);
      })
      .catch((e) => {
        this.errorOwner?.use(e);
      });
    return this;
  }
}
