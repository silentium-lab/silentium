import { ConstructorType } from "types/ConstructorType";
import { MessageType } from "types/MessageType";
import { TransportType } from "types/TransportType";

/**
 * Creates a transport that applies a constructor to the result of another transport.
 */
export function TransportApplied<T>(
  baseTransport: TransportType<any, MessageType<T>>,
  applier: ConstructorType<[MessageType], MessageType<T>>,
) {
  return new TransportAppliedImpl(baseTransport, applier);
}

export class TransportAppliedImpl<T>
  implements TransportType<unknown, MessageType<T>>
{
  public constructor(
    private baseTransport: TransportType<any, MessageType<T>>,
    private applier: ConstructorType<[MessageType], MessageType<T>>,
  ) {}

  public use(args: unknown) {
    return this.applier(this.baseTransport.use(args));
  }
}
