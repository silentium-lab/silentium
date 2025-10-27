import { ensureEvent } from "../helpers";
import { ParentTransport } from "./Transport";
import { DestroyableType, EventType, TransportType } from "../types";

/**
 * Create local copy of source what can be destroyed
 */
export function Local<T>($base: EventType<T>) {
  return new TheLocal<T>($base);
}

class TheLocal<T> implements EventType<T>, DestroyableType {
  private destroyed = false;

  public constructor(private $base: EventType<T>) {
    ensureEvent($base, "Local: $base");
  }

  public event(transport: TransportType<T>): this {
    this.$base.event(this.transport.child(transport));
    return this;
  }

  private transport = new ParentTransport((v: T, child: TransportType<T>) => {
    if (!this.destroyed) {
      child.use(v);
    }
  });

  public destroy(): this {
    return this;
  }
}
