import { ConstructorType } from "types/ConstructorType";
import { MessageType } from "types/MessageType";

export function MessageActor<T>(
  $base: MessageType<T>,
  executor: (a: SourceActor<T>, v: T, ...args: unknown[]) => void,
  ...args: unknown[]
) {
  return new MessageActorImpl($base, executor, ...args);
}

export class MessageActorImpl<T> implements MessageType<T> {
  private args: unknown[];

  public constructor(
    private $base: MessageType<T>,
    private executor: (a: SourceActor<T>, v: T, ...args: unknown[]) => void,
    ...args: unknown[]
  ) {
    this.args = args;
  }

  public then(resolve: ConstructorType<[T]>): this {
    const $actor = new SourceActor(resolve);
    this.$base.then((v) => {
      this.executor($actor, v, ...this.args);
    });
    return this;
  }
}

class SourceActor<T> {
  public constructor(private resolve: ConstructorType<[T]>) {}

  public use(v: T) {
    this.resolve(v);
  }
}
