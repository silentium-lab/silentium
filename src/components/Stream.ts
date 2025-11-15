import { TransportParent } from "base/Transport";
import { MessageType } from "types/MessageType";
import { TransportType } from "types/TransportType";

/**
 * Component that receives a data array and yields values one by one
 */
export function Stream<T>($base: MessageType<T[]>) {
  return new StreamImpl<T>($base);
}

export class StreamImpl<T> implements MessageType<T> {
  public constructor(private $base: MessageType<T[]>) {}

  public to(transport: TransportType<T>): this {
    this.$base.to(this.parent.child(transport));
    return this;
  }

  private parent = TransportParent<T[]>(function (v) {
    v.forEach((cv) => {
      this.use(cv);
    });
  });
}
