import { isDestroyable } from "helpers/guards";
import { DestroyableType } from "types/DestroyableType";
import { MessageType } from "types/MessageType";
import { TapType } from "types/TapType";

/**
 * Creates a tap wrapper that automatically manages destruction of created instances
 */
export function TapDestroyable<T>(baseTap: TapType<any[], MessageType<T>>) {
  return new TapDestroyableImpl<T>(baseTap);
}

export class TapDestroyableImpl<T>
  implements TapType<unknown, MessageType<T>>, DestroyableType
{
  private destructors: DestroyableType[] = [];

  public constructor(private baseTap: TapType<any[], MessageType<T>>) {}

  public use(args: any[]) {
    const inst = this.baseTap.use(args);
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
