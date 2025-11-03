import { SourceType } from "types/SourceType";
import { Late } from "components/Late";
import { SharedSource } from "components/SharedSource";
import { TransportType } from "types/TransportType";
import { Primitive, PrimitiveImpl } from "components/Primitive";

/**
 * An event with a value that will be set later,
 * capable of responding to different transports
 */
export function LateShared<T>(value?: T) {
  return new LateSharedEvent<T>(value);
}

export class LateSharedEvent<T> implements SourceType<T> {
  private $event: SourceType<T>;
  private primitive: PrimitiveImpl<T>;

  public constructor(value?: T) {
    this.$event = SharedSource(Late(value));
    this.primitive = Primitive(this, value);
  }

  public event(transport: TransportType<T>) {
    this.$event.event(transport);
    return this;
  }

  public use(value: T) {
    this.$event.use(value);
    return this;
  }

  public value() {
    return this.primitive;
  }
}
