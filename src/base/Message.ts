import { ensureFunction } from "helpers/ensures";
import { DestroyableType } from "types/DestroyableType";
import { MessageType } from "types/MessageType";
import { TapType } from "types/TapType";

type MessageExecutorType<T> = (
  this: TapType<T>,
  tap: TapType<T>,
) => void | (() => void);

/**
 * A message created from an executor function.
 * The executor function can return a message destruction function.
 */
export function Message<T>(executor: MessageExecutorType<T>) {
  return new MessageImpl<T>(executor);
}

export class MessageImpl<T> implements MessageType<T>, DestroyableType {
  private mbDestructor: unknown;

  public constructor(private executor: MessageExecutorType<T>) {
    ensureFunction(executor, "Message: executor");
  }

  public pipe(tap: TapType<T>) {
    this.mbDestructor = this.executor.call(tap, tap);
    return this;
  }

  public destroy() {
    if (typeof this.mbDestructor === "function") {
      this.mbDestructor?.();
    }
    return this;
  }
}
