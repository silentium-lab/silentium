import { ConstructorType } from "types/ConstructorType";
import { MessageType } from "types/MessageType";
import { TapType } from "types/TapType";

/**
 * Creates a tap that applies a constructor to the result of another tap.
 */
export function TapApplied<T>(
  baseTap: TapType<any, MessageType<T>>,
  applier: ConstructorType<[MessageType], MessageType<T>>,
) {
  return new TapAppliedImpl(baseTap, applier);
}

export class TapAppliedImpl<T> implements TapType<unknown, MessageType<T>> {
  public constructor(
    private baseTap: TapType<any, MessageType<T>>,
    private applier: ConstructorType<[MessageType], MessageType<T>>,
  ) {}

  public use(args: unknown) {
    return this.applier(this.baseTap.use(args));
  }
}
