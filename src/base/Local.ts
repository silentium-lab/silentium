import { MessageType } from "types/MessageType";
import { TransportParent } from "base/Transport";
import { ensureMessage } from "helpers/ensures";
import { TransportType } from "types/TransportType";
import { DestroyableType } from "types/DestroyableType";

/**
 * Create local copy of source what can be destroyed
 */
export function Local<T>($base: MessageType<T>) {
  return new LocalImpl<T>($base);
}

export class LocalImpl<T> implements MessageType<T>, DestroyableType {
  private destroyed = false;

  public constructor(private $base: MessageType<T>) {
    ensureMessage($base, "Local: $base");
  }

  public to(transport: TransportType<T>): this {
    this.$base.to(this.transport.child(transport));
    return this;
  }

  private transport = TransportParent(function (v: T, child: LocalImpl<T>) {
    if (!child.destroyed) {
      this.use(v);
    }
  }, this);

  public destroy(): this {
    this.destroyed = true;
    return this;
  }
}
