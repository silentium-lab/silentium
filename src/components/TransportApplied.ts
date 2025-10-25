import { EventType, ConstructorType, TransportType } from "../types";

export class TransportApplied<T> implements TransportType {
  public constructor(
    private baseTransport: TransportType<any[], T>,
    private applier: ConstructorType<[EventType], EventType<T>>,
  ) {}

  public of(...args: unknown[]): EventType<unknown> {
    return this.applier(this.baseTransport.of(...args));
  }
}
