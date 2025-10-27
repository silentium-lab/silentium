import { isDestroyable } from "../helpers";
import { DestroyableType, EventType, TransportType } from "../types";

export function TransportDestroyable<T>(
  baseTransport: TransportType<any[], EventType<T>>,
) {
  return new TheTransportDestroyable<T>(baseTransport);
}

/**
 * Constructor what can be destroyed
 */
class TheTransportDestroyable<T>
  implements TransportType<unknown[], EventType>, DestroyableType
{
  private destructors: DestroyableType[] = [];

  public constructor(
    private baseTransport: TransportType<any[], EventType<T>>,
  ) {}

  public use(args: unknown[]) {
    const inst = this.baseTransport.use(args);
    if (isDestroyable(inst)) {
      this.destructors.push(inst);
    }
    return inst;
  }

  public destroy(): this {
    this.destructors.forEach((i) => i.destroy());
    return this;
  }
}
