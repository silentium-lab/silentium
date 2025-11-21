import { MessageType } from "types/MessageType";
import { MessageSourceType, SourceType } from "types/SourceType";
import { ConstructorType } from "types/ConstructorType";
import { isFilled } from "helpers/guards";
import { Primitive } from "components/Primitive";

/**
 * An information object that helps multiple owners access
 * a single another information object
 */
export function Shared<T>($base: MessageType<T>, source?: SourceType<T>) {
  return new SharedImpl<T>($base, source);
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

  public constructor(
    private $base: MessageType<T>,
    private source?: SourceType<T>,
  ) {}

  public then(resolved: ConstructorType<[T]>) {
    this.resolvers.add(resolved);
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
    return this;
  }

  public value() {
    return Primitive(this);
  }
}
