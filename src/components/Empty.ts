import { Filtered } from "components/Filtered";
import { LateShared } from "components/LateShared";
import { Shared } from "components/Shared";
import { EmptyType } from "types/EmptyType";
import { MessageType } from "types/MessageType";

export const Nothing = Symbol("nothing");

/**
 * Helps to split message and empty
 * response
 */
export function Empty<T>($base: MessageType<T>) {
  return new EmptyImpl<T>($base);
}

export class EmptyImpl<T> implements EmptyType {
  private $empty = LateShared<boolean>();

  public constructor(private $base: MessageType<T>) {}

  public message() {
    Shared(this.$base).then((v) => {
      if (v === Nothing) {
        this.$empty.use(true);
      }
    });
    return Filtered(this.$base, (v) => v !== Nothing);
  }

  public empty(): MessageType<boolean> {
    return this.$empty;
  }
}
