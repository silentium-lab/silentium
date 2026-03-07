import { Message, MessageImpl } from "base/Message";
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

  public constructor(private $base: MessageType<T> | MessageSourceType<T>) {
    if (isSource($base)) {
      this.source = $base;
    }
  }

  public then(
    resolved: ConstructorType<[T]>,
    rejected?: ConstructorType<[unknown]>,
  ): MessageImpl<T> {
    this.resolvers.add(resolved);
    if (this.resolvers.size === 1) {
      this.$base.then(this.resolver, rejected);
    } else if (isFilled(this.lastV)) {
      resolved(this.lastV);
    }
    return Message((r) => {
      if (isFilled(this.lastV)) {
        r(this.lastV);
      }
      return () => {
        this.resolvers.delete(resolved);
      };
    });
  }

  public use(value: T) {
    if (this.source) {
      this.source.use(value);
    } else {
      this.resolver(value);
    }
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
