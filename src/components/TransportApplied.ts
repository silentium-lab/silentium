import { EventType, ConstructorType, TransportType } from "../types";

export function TransportApplied<T>(
  baseTransport: TransportType<any, EventType<T>>,
  applier: ConstructorType<[EventType], EventType<T>>,
) {
  return new TheTransportApplied(baseTransport, applier);
}

export class TheTransportApplied<T>
  implements TransportType<unknown, EventType<T>>
{
  public constructor(
    private baseTransport: TransportType<any, EventType<T>>,
    private applier: ConstructorType<[EventType], EventType<T>>,
  ) {}

  public use(args: unknown) {
    return this.applier(this.baseTransport.use(args));
  }
}
