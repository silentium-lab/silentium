import { ConstructorType } from "types/ConstructorType";
import { EventType } from "types/EventType";
import { TransportType } from "types/TransportType";

/**
 * Creates a transport that applies a constructor to the result of another transport.
 */
export function TransportApplied<T>(
  baseTransport: TransportType<any, EventType<T>>,
  applier: ConstructorType<[EventType], EventType<T>>,
) {
  return new TransportAppliedImpl(baseTransport, applier);
}

export class TransportAppliedImpl<T>
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
