import { isDestroyable } from "helpers/guards";
import { DestroyableType } from "types/DestroyableType";
import { MessageType } from "types/MessageType";
import { TransportType } from "types/TransportType";

/**
 * Creates a transport wrapper that automatically manages destruction of created instances
 */
export function TransportDestroyable<T>(
  baseTransport: TransportType<any[], MessageType<T>>,
) {
  return new TransportDestroyableImpl<T>(baseTransport);
}

export class TransportDestroyableImpl<T>
  implements TransportType<unknown, MessageType<T>>, DestroyableType
{
  private destructors: DestroyableType[] = [];

  public constructor(
    private baseTransport: TransportType<any[], MessageType<T>>,
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
