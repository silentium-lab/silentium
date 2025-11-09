import { EventType } from "types/EventType";
import { TransportType } from "types/TransportType";

/**
 * Allows subscribing a transport to an event
 * even if the transport reference does not exist,
 * helps avoid unnecessary conditions in application code
 */
export function TransportOptional(base?: TransportType) {
  return new TransportOptionalImpl(base);
}

export class TransportOptionalImpl {
  public constructor(private base?: TransportType) {}

  public wait(event: EventType) {
    if (this.base !== undefined) {
      event.event(this.base);
    }
    return this;
  }
}
