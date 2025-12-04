import { Filtered } from "components/Filtered";
import { Late } from "components/Late";
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
  private $empty = Late<boolean>();

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
