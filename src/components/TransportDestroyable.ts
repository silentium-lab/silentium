import { DestroyableType, isDestroyable, TransportType } from "../types";

/**
 * Constructor what can be destroyed
 */
export class TransportDestroyable<T> implements TransportType, DestroyableType {
  private destructors: DestroyableType[] = [];

  public constructor(private baseTransport: TransportType<any[], T>) {}

  public of(...args: unknown[]) {
    const inst = this.baseTransport.of(...args);
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
