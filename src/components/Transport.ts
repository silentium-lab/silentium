import { ConstructorType, EventType, TransportType } from "../types";

export class Transport<T> implements TransportType<any[], T> {
  public constructor(private executor: ConstructorType<any[], EventType<T>>) {}

  public of(...args: any[]): EventType<T> {
    return this.executor(...args);
  }
}
