import { DestroyContainer } from "base/DestroyContainer";
import { Rejections } from "base/Rejections";
import { ensureFunction } from "helpers/ensures";
import { isMessage } from "helpers/guards";
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
 */
export function Message<T>(executor: MessageExecutorType<T>) {
  return new MessageRx<T>(executor);
}

/**
 * Reactive message implementation
 */
export class MessageRx<T> implements MessageType<T>, DestroyableType {
  private rejections = new Rejections();
  private dc = DestroyContainer();

  public constructor(private executor: MessageExecutorType<T>) {
    ensureFunction(executor, "Message: executor");
  }

  public then(resolve: ConstructorType<[T]>) {
    let thenResult: MessageType = this as MessageType;
    try {
      const proxyResolve = (v: T) => {
        const result = resolve(v);
        this.dc.add(result);
        if (isMessage(result)) {
          thenResult = result;
        }
      };
      this.dc.add(this.executor(proxyResolve, this.rejections.reject));
    } catch (e: any) {
      this.rejections.reject(e);
    }
    return thenResult;
  }

  public catch(rejected: ConstructorType<[unknown]>) {
    this.rejections.catch(rejected);
    return this;
  }

  public destroy() {
    this.dc.destroy();
    this.rejections.destroy();
    return this;
  }
}
