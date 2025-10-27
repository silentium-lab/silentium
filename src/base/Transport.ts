import { ensureFunction } from "../helpers";
import { EventType, TransportType } from "../types";

/**
 * Type of value transfer logic executor
 */
export type TransportExecutor<T> = (v: T) => void;

/**
 * Base transport that accepts the passed value,
 * acts as a conductor to deliver the value from an event to somewhere
 */
export function Transport<T>(transportExecutor: TransportExecutor<T>) {
  return new TheTransport<T>(transportExecutor);
}

class TheTransport<T> implements TransportType<T> {
  public constructor(private transportExecutor: TransportExecutor<T>) {
    ensureFunction(transportExecutor, "Transport: transport executor");
  }

  public use(value: T) {
    this.transportExecutor(value);
    return this;
  }
}

/**
 * Type of executor for value passing logic and event returning
 */
export type TransportEventExecutor<T, ET = T> = (v: T) => EventType<ET>;

/**
 * A transport that delivers a value from one event
 * and returns another event based on the value
 */
export function TransportEvent<T, ET = any>(
  transportExecutor: TransportEventExecutor<T, ET>,
) {
  return new TheTransportEvent<T, ET>(transportExecutor);
}

class TheTransportEvent<T, ET = T> implements TransportType<T, EventType<ET>> {
  public constructor(private executor: TransportEventExecutor<T, ET>) {
    ensureFunction(executor, "TheTransportEvent: transport executor");
  }

  public use(value: T) {
    return this.executor(value);
  }
}

/**
 * A transport that accepts a child transport
 * to perform some transformation on the value
 * during its transmission
 */
export class ParentTransport<T> implements TransportType<T> {
  public constructor(
    private executor: (v: T, transport: TransportType, ...args: any[]) => void,
    private args: any[] = [],
    private _child?: TransportType<T>,
  ) {
    ensureFunction(executor, "ParentTransport: executor");
  }

  public use(value: T): this {
    if (this._child === undefined) {
      throw new Error("no base transport");
    }
    this.executor(value, this._child, ...this.args);
    return this;
  }

  public child(transport: TransportType, ...args: any[]) {
    return new ParentTransport(
      this.executor,
      [...this.args, ...args],
      transport,
    );
  }
}
