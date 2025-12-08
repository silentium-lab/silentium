import { Message, MessageExecutorType, MessageImpl } from "base/Message";
import { ConstructorType } from "types/ConstructorType";
import { MessageSourceType } from "types/SourceType";

/**
 * Base message source object
 */
export function MessageSource<T>(
  messageExecutor: MessageExecutorType<T>,
  sourceExecutor: ConstructorType<[T]>,
) {
  return new MessageSourceImpl(messageExecutor, sourceExecutor);
}

export class MessageSourceImpl<T> implements MessageSourceType<T> {
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
}
