import { Message, MessageExecutorType, MessageImpl } from "base/Message";
import { ConstructorType } from "types/ConstructorType";
import { MessageType } from "types/MessageType";
import { MessageSourceType } from "types/SourceType";

/**
 * Base message source object
 * https://silentium.pw/article/message-source/view
 */
export function Source<T>(
  messageExecutor: MessageExecutorType<T>,
  sourceExecutor: ConstructorType<[T]>,
) {
  return new SourceImpl(messageExecutor, sourceExecutor);
}

export class SourceImpl<T> implements MessageSourceType<T> {
  private message: MessageImpl<T>;

  public constructor(
    messageExecutor: MessageExecutorType<T>,
    private sourceExecutor: ConstructorType<[T]>,
  ) {
    this.message = Message(messageExecutor);
  }

  public use(value: T): this {
    this.sourceExecutor(value);
    return this;
  }

  public then(resolved: ConstructorType<[T]>): this {
    this.message.then(resolved);
    return this;
  }

  public catch(rejected: ConstructorType<[unknown]>): this {
    this.message.catch(rejected);
    return this;
  }

  public destroy() {
    this.message.destroy();
    return this;
  }

  public chain(m: MessageType<T>) {
    m.then(this.use.bind(this));
    return this;
  }
}
