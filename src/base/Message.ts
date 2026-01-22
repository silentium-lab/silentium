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
  public constructor(
    private executor: MessageExecutorType<T>,
    private rejections = Rejections(),
    private dc = DestroyContainer(),
  ) {
    ensureFunction(executor, "Message: executor");
  }

  public then(resolve: ConstructorType<[T]>) {
    if (this.dc.destroyed()) {
      return this;
    }
    const newMessageRejections = Rejections();
    const newMessageDc = DestroyContainer();
    const newMessage = new MessageImpl(
      this.executor,
      newMessageRejections,
      newMessageDc,
    );
    newMessage.catch(this.rejections.reject);
    this.dc.add(newMessage);
    try {
      const mbDestructor = this.executor(
        Silence((value: T) => {
          if (!newMessageDc.destroyed()) {
            resolve(value);
          }
        }),
        newMessageRejections.reject,
      );
      newMessageDc.add(mbDestructor);
    } catch (e: any) {
      newMessageRejections.reject(e);
    }
    return newMessage;
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
