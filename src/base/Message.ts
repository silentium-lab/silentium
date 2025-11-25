import { DestroyContainer } from "base/DestroyContainer";
import { Rejections } from "base/Rejections";
import { LateShared } from "components/LateShared";
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
 */
export function Message<T>(
  executor: MessageExecutorType<T>,
  everyThenCallsExecutor: boolean = false,
) {
  return new MessageRx<T>(executor, everyThenCallsExecutor);
}

/**
 * Reactive message implementation
 */
export class MessageRx<T> implements MessageType<T>, DestroyableType {
  private rejections = new Rejections();
  private dc = DestroyContainer();
  private executed = false;
  private late = LateShared<T>();

  public constructor(
    private executor: MessageExecutorType<T>,
    private everyThenCallsExecutor: boolean = false,
  ) {
    ensureFunction(executor, "Message: executor");
  }

  public then(resolve: ConstructorType<[T]>) {
    try {
      if (this.everyThenCallsExecutor) {
        this.dc.add(this.executor(resolve, this.rejections.reject));
      } else if (!this.executed) {
        this.executed = true;
        this.late.then(resolve);
        this.dc.add(
          this.executor((v) => {
            this.late.use(v);
          }, this.rejections.reject),
        );
      } else {
        this.late.then(resolve);
      }
    } catch (e: any) {
      this.rejections.reject(e);
    }
    return this;
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
