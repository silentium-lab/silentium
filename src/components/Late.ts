import { SourceType } from "types/SourceType";
import { isFilled } from "helpers/guards";
import { TransportType } from "types/TransportType";

/**
 * A component that allows creating linked objects of information and its owner
 * in such a way that if a new value is assigned to the owner, this value
 * will become the value of the linked information source
 * https://silentium-lab.github.io/silentium/#/en/information/of
 */
export function Late<T>(v?: T) {
  return new LateEvent<T>(v);
}

class LateEvent<T> implements SourceType<T> {
  private lateTransport: TransportType<T> | null = null;
  private notify = (v?: T) => {
    if (isFilled(v) && this.lateTransport) {
      this.lateTransport.use(v);
    }
  };

  public constructor(private v?: T) {}

  public event(transport: TransportType<T>): this {
    if (this.lateTransport) {
      throw new Error(
        "Late component gets new transport, when another was already connected!",
      );
    }
    this.lateTransport = transport;
    this.notify(this.v);
    return this;
  }

  public use(value: T): this {
    this.notify(value);
    return this;
  }
}
