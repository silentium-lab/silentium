import { MessageType } from "types/MessageType";
import { TransportParent } from "base/Transport";
import { ConstructorType } from "types/ConstructorType";
import { ensureMessage } from "helpers/ensures";
import { TransportType } from "types/TransportType";

/**
 * An message that applies a function
 * to the value of the base message
 */
export function Applied<const T, R>(
  $base: MessageType<T>,
  applier: ConstructorType<[T], R>,
) {
  return new AppliedImpl<T, R>($base, applier);
}

export class AppliedImpl<T, R> implements MessageType<R> {
  public constructor(
    private $base: MessageType<T>,
    private applier: ConstructorType<[T], R>,
  ) {
    ensureMessage($base, "Applied: base");
  }

  public to(transport: TransportType<R>) {
    this.$base.to(this.transport.child(transport));
    return this;
  }

  private transport = TransportParent(function (
    v: T,
    child: AppliedImpl<T, R>,
  ) {
    this.use(child.applier(v));
  }, this);
}
