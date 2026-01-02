import { DestroyContainer } from "base/DestroyContainer";
import { Rejections } from "base/Rejections";
import { Silence } from "base/Silence";
import { ensureFunction } from "helpers/ensures";
import { ConstructorType } from "types/ConstructorType";
import { DestroyableType } from "types/DestroyableType";
import { MessageType } from "types/MessageType";

export type MessageExecutorType<T> = (
  resolve: ConstructorType<[T]>,
  reject: ConstructorType<[unknown]>,
) => MessageType | (() => void) | void;

/**
 * A message created from an executor function.
 * The executor function can return a message destruction function.
 *
 * @url https://silentium.pw/article/message/view
 */
export function Message<T>(executor: MessageExecutorType<T>) {
  return new MessageImpl<T>(executor);
}

/**
 * Reactive message implementation
 *
 * @url https://silentium.pw/article/message/view
 */
export class MessageImpl<T> implements MessageType<T>, DestroyableType {
  private rejections = new Rejections();
  private dc = DestroyContainer();

  public constructor(private executor: MessageExecutorType<T>) {
    ensureFunction(executor, "Message: executor");
  }

  public then(resolve: ConstructorType<[T]>) {
    if (this.dc.destroyed()) {
      return this;
    }
    try {
      this.dc.add(this.executor(Silence(resolve), this.rejections.reject));
    } catch (e: any) {
      this.rejections.reject(e);
    }
    return this;
  }

  public catch(rejected: ConstructorType<[unknown]>) {
    if (this.dc.destroyed()) {
      return this;
    }
    this.rejections.catch(rejected);
    return this;
  }

  public destroy() {
    this.dc.destroy();
    this.rejections.destroy();
    return this;
  }
}
