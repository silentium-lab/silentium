import { ensureFunction } from "helpers/ensures";
import { ConstructorType } from "types/ConstructorType";
import { DestroyableType } from "types/DestroyableType";
import { MessageType } from "types/MessageType";

type MessageExecutorType<T> = (
  resolve: ConstructorType<[T]>,
) => unknown | (() => void);

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

  public then(resolve: ConstructorType<[T]>) {
    this.mbDestructor = this.executor(resolve);
    return this;
  }

  public destroy() {
    if (typeof this.mbDestructor === "function") {
      this.mbDestructor?.();
    }
    return this;
  }
}
