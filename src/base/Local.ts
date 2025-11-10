import { EventType } from "types/EventType";
import { TransportParent } from "base/Transport";
import { ensureEvent } from "helpers/ensures";
import { TransportType } from "types/TransportType";
import { DestroyableType } from "types/DestroyableType";

/**
 * Create local copy of source what can be destroyed
 */
export function Local<T>($base: EventType<T>) {
  return new LocalEvent<T>($base);
}

export class LocalEvent<T> implements EventType<T>, DestroyableType {
  private destroyed = false;

  public constructor(private $base: EventType<T>) {
    ensureEvent($base, "Local: $base");
  }

  public event(transport: TransportType<T>): this {
    this.$base.event(this.transport.child(transport));
    return this;
  }

  private transport = TransportParent(function (v: T, child: LocalEvent<T>) {
    if (!child.destroyed) {
      this.use(v);
    }
  }, this);

  public destroy(): this {
    this.destroyed = true;
    return this;
  }
}
