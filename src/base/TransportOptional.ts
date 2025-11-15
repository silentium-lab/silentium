import { MessageType } from "types/MessageType";
import { TransportType } from "types/TransportType";

/**
 * Allows subscribing a transport to a message
 * even if the transport reference does not exist,
 * helps avoid unnecessary conditions in application code
 */
export function TransportOptional(base?: TransportType) {
  return new TransportOptionalImpl(base);
}

export class TransportOptionalImpl {
  public constructor(private base?: TransportType) {}

  public wait(m: MessageType) {
    if (this.base !== undefined) {
      m.to(this.base);
    }
    return this;
  }
}
