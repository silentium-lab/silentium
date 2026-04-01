import { Message, MessageImpl } from "base/Message";
import { SilenceUse } from "base/Silence";
import { Primitive } from "components/Primitive";
import { isDestroyable, isFilled, isSource } from "helpers/guards";
import { ConstructorType } from "types/ConstructorType";
import { MessageType } from "types/MessageType";
import { MessageSourceType, SourceType } from "types/SourceType";

/**
 * An information object that helps multiple owners access
 * a single another information object
 *
 * @url https://silentium.pw/article/shared/view
 */
export function Shared<T>($base: MessageType<T> | MessageSourceType<T>) {
  return new SharedImpl<T>($base);
}

export class SharedImpl<T> implements MessageSourceType<T> {
  private resolver = (v: T) => {
    this.lastV = v;
    this.resolvers.forEach((r) => {
      r(v);
    });
  };
  private lastV: T | undefined;
  private resolvers = new Set<ConstructorType<[T]>>();
  private source?: SourceType<T>;
  private isDestroyed = false;
  private silenceUse: ReturnType<typeof SilenceUse>;

  public constructor(private $base: MessageType<T> | MessageSourceType<T>) {
    if (isSource($base)) {
      this.source = $base;
    }
    this.silenceUse = SilenceUse(this);
  }

  public then(
    resolved: ConstructorType<[T]>,
    rejected?: ConstructorType<[unknown]>,
  ): MessageImpl<T> {
    const msg$ = Message<T>((res, rej) => {
      this.resolvers.add(res);
      if (this.resolvers.size === 1) {
        this.$base.then(this.resolver, rej);
      } else if (isFilled(this.lastV)) {
        res(this.lastV);
      }
      return () => {
        this.resolvers.delete(res);
      };
    }).then(resolved);

    if (rejected) {
      msg$.catch(rejected);
    }

    return msg$;
  }

  public use(value: T) {
    this.silenceUse.use(value, (v) => {
      if (this.source) {
        this.source.use(v as T);
      } else {
        this.resolver(v as T);
      }
    });
    return this;
  }

  public catch(rejected: ConstructorType<[unknown]>) {
    this.$base.catch(rejected);
    return this;
  }

  public destroy() {
    this.isDestroyed = true;
    this.resolvers.clear();
    if (isDestroyable(this.$base)) {
      this.$base.destroy();
    }
    return this;
  }

  public destroyed() {
    return this.isDestroyed;
  }

  public value() {
    return Primitive(this);
  }

  public chain(m: MessageType<T>) {
    m.then(this.use.bind(this));
    return this;
  }
}
