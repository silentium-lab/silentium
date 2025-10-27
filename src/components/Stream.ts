import { ParentTransport } from "../base";
import { EventType, TransportType } from "../types";

/**
 * Component that receives a data array and yields values one by one
 */
export function Stream<T>($base: EventType<T[]>) {
  return new TheStream<T>($base);
}

class TheStream<T> implements EventType<T> {
  public constructor(private $base: EventType<T[]>) {}

  public event(transport: TransportType<T>): this {
    this.$base.event(this.parent.child(transport));
    return this;
  }

  private parent = new ParentTransport<T[]>((v, child) => {
    v.forEach((cv) => {
      child.use(cv);
    });
  });
}
