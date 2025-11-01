import { isDestroyable } from "../helpers";
import { DestroyableType, EventType, TransportType } from "../types";

/**
 * Creates a transport wrapper that automatically manages destruction of created instances
 */
export function TransportDestroyable<T>(
  baseTransport: TransportType<any[], EventType<T>>,
) {
  return new TransportDestroyableEvent<T>(baseTransport);
}

class TransportDestroyableEvent<T>
  implements TransportType<unknown, EventType<T>>, DestroyableType
{
  private destructors: DestroyableType[] = [];

  public constructor(
    private baseTransport: TransportType<any[], EventType<T>>,
  ) {}

  public use(args: any[]) {
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
