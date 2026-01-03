import { MessageType } from "types/MessageType";
import { MessageSourceType, SourceType } from "types/SourceType";
import { ConstructorType } from "types/ConstructorType";
import { isDestroyable, isFilled, isSource } from "helpers/guards";
import { Primitive } from "components/Primitive";

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

  public constructor(private $base: MessageType<T> | MessageSourceType<T>) {
    if (isSource($base)) {
      this.source = $base;
    }
  }

  public then(resolved: ConstructorType<[T]>) {
    this.resolvers.add((v) => resolved(v));
    if (this.resolvers.size === 1) {
      this.$base.then(this.resolver);
    } else if (isFilled(this.lastV)) {
      resolved(this.lastV);
    }
    return this;
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
    this.resolvers.clear();
    if (isDestroyable(this.$base)) {
      this.$base.destroy();
    }
    return this;
  }

  public value() {
    return Primitive(this);
  }

  public chain(m: MessageType<T>) {
    m.then(this.use.bind(this));
    return this;
  }
}
