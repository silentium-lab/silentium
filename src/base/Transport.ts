import { ensureFunction } from "helpers/ensures";
import { MessageType } from "types/MessageType";
import { TransportType } from "types/TransportType";

/**
 * Type of value transfer logic executor
 */
export type TransportExecutor<T> = (v: T) => void;

/**
 * Base transport that accepts the passed value,
 * acts as a conductor to deliver the value from a message to somewhere
 */
export function Transport<T>(transportExecutor: TransportExecutor<T>) {
  return new TransportImpl<T>(transportExecutor);
}

export class TransportImpl<T> implements TransportType<T> {
  public constructor(private executor: TransportExecutor<T>) {
    ensureFunction(executor, "Transport: transport executor");
  }

  public use(value: T) {
    this.executor(value);
    return this;
  }
}

/**
 * Type of executor for value passing logic and message returning
 */
export type TransportMessageExecutor<T, ET = T> = (v: T) => MessageType<ET>;

/**
 * A transport that delivers a value from one message
 * and returns another message based on the value
 */
export function TransportMessage<T, ET = any>(
  executor: TransportMessageExecutor<T, ET>,
) {
  return new TransportMessageImpl<T, ET>(executor);
}

export class TransportMessageImpl<T, ET = T>
  implements TransportType<T, MessageType<ET>>
{
  public constructor(private executor: TransportMessageExecutor<T, ET>) {
    ensureFunction(executor, "TransportMessage: transport executor");
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
export function TransportParent<T>(
  executor: (this: TransportType, v: T, ...context: any[]) => void,
  ...args: any[]
) {
  return new TransportParentImpl<T>(executor, args);
}

export class TransportParentImpl<T> implements TransportType<T> {
  public constructor(
    private executor: (this: TransportType, v: T, ...context: any[]) => void,
    private args: any[] = [],
    private _child?: TransportType<T>,
  ) {
    ensureFunction(executor, "TransportParent: executor");
  }

  public use(value: T): this {
    if (this._child === undefined) {
      throw new Error("no base transport");
    }
    this.executor.call(this._child, value, ...this.args);
    return this;
  }

  public child(transport: TransportType, ...args: any[]) {
    return new TransportParentImpl(
      this.executor,
      [...this.args, ...args],
      transport,
    );
  }
}
