import { SourceType } from "types/SourceType";
import { Late } from "components/Late";
import { SharedSource } from "components/SharedSource";
import { TapType } from "types/TapType";
import { Primitive, PrimitiveImpl } from "components/Primitive";

/**
 * An message with a value that will be set later,
 * capable of responding to different taps
 */
export function LateShared<T>(value?: T) {
  return new LateSharedImpl<T>(value);
}

export class LateSharedImpl<T> implements SourceType<T> {
  private $msg: SourceType<T>;
  private primitive: PrimitiveImpl<T>;

  public constructor(value?: T) {
    this.$msg = SharedSource(Late(value));
    this.primitive = Primitive(this, value);
  }

  public pipe(tap: TapType<T>) {
    this.$msg.pipe(tap);
    return this;
  }

  public use(value: T) {
    this.$msg.use(value);
    return this;
  }

  public value() {
    return this.primitive;
  }
}
