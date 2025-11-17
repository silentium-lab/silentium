import { MessageType } from "types/MessageType";
import { TapType } from "types/TapType";

/**
 * Allows subscribing a tap to a message
 * even if the tap reference does not exist,
 * helps avoid unnecessary conditions in application code
 */
export function TapOptional(base?: TapType) {
  return new TapOptionalImpl(base);
}

export class TapOptionalImpl {
  public constructor(private base?: TapType) {}

  public wait(m: MessageType) {
    if (this.base !== undefined) {
      m.pipe(this.base);
    }
    return this;
  }
}
