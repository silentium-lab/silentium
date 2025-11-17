import { ensureFunction } from "helpers/ensures";
import { MessageType } from "types/MessageType";
import { TapType } from "types/TapType";

/**
 * Type of value transfer logic executor
 */
export type TapExecutor<T> = (v: T) => void;

/**
 * Base tap that accepts the passed value,
 * acts as a conductor to deliver the value from a message to somewhere
 */
export function Tap<T>(executor: TapExecutor<T>) {
  return new TapImpl<T>(executor);
}

export class TapImpl<T> implements TapType<T> {
  public constructor(private executor: TapExecutor<T>) {
    ensureFunction(executor, "Tap: tap executor");
  }

  public use(value: T) {
    this.executor(value);
    return this;
  }
}

/**
 * Type of executor for value passing logic and message returning
 */
export type TapMessageExecutor<T, ET = T> = (v: T) => MessageType<ET>;

/**
 * A tap that delivers a value from one message
 * and returns another message based on the value
 */
export function TapMessage<T, ET = any>(executor: TapMessageExecutor<T, ET>) {
  return new TapMessageImpl<T, ET>(executor);
}

export class TapMessageImpl<T, ET = T> implements TapType<T, MessageType<ET>> {
  public constructor(private executor: TapMessageExecutor<T, ET>) {
    ensureFunction(executor, "TapMessage: tap executor");
  }

  public use(value: T) {
    return this.executor(value);
  }
}

/**
 * A tap that accepts a child tap
 * to perform some transformation on the value
 * during its transmission
 */
export function TapParent<T>(
  executor: (this: TapType, v: T, ...context: any[]) => void,
  ...args: any[]
) {
  return new TapParentImpl<T>(executor, args);
}

export class TapParentImpl<T> implements TapType<T> {
  public constructor(
    private executor: (this: TapType, v: T, ...context: any[]) => void,
    private args: any[] = [],
    private _child?: TapType<T>,
  ) {
    ensureFunction(executor, "TapParent: executor");
  }

  public use(value: T): this {
    if (this._child === undefined) {
      throw new Error("no base tap");
    }
    this.executor.call(this._child, value, ...this.args);
    return this;
  }

  public child(tap: TapType, ...args: any[]) {
    return new TapParentImpl(this.executor, [...this.args, ...args], tap);
  }
}
