import { ActualMessage } from "base/ActualMessage";
import { MessageActor } from "base/MessageActor";
import { ensureMessage } from "helpers/ensures";
import { ConstructorType } from "types/ConstructorType";
import { DestroyableType } from "types/DestroyableType";
import { MaybeMessage, MessageType } from "types/MessageType";

/**
 * Create local copy of source what can be destroyed
 */
export function Local<T>($base: MaybeMessage<T>) {
  return new LocalImpl<T>(ActualMessage($base));
}

export class LocalImpl<T> implements MessageType<T>, DestroyableType {
  private destroyed = false;
  private actor: MessageType<T>;

  public constructor($base: MessageType<T>) {
    ensureMessage($base, "Local: $base");
    this.actor = MessageActor($base, (a, v) => {
      if (!this.destroyed) {
        a.use(v);
      }
    });
  }

  public then(resolve: ConstructorType<[T]>): this {
    this.actor.then(resolve);
    return this;
  }

  public destroy(): this {
    this.destroyed = true;
    return this;
  }
}
