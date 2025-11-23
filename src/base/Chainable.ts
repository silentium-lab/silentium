import { ChainableType } from "types/ChainableType";
import { MessageType } from "types/MessageType";
import { SourceType } from "types/SourceType";

/**
 * Helps to connect Different
 * message and source
 */
export class Chainable<T> implements ChainableType<T> {
  public constructor(private src: SourceType<T>) {}

  public chain($m: MessageType<T>) {
    $m.then(this.src.use.bind(this.src));
    return this;
  }
}
