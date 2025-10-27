import { ensureEvent, ensureTransport } from "../helpers";
import { EventType, TransportType } from "../types";

/**
 * An event representing a base event where
 * its operation is wrapped in try-catch
 * and expects exceptions. If an exception
 * bubbles up, it's passed to the transports
 * as errorMessage and errorOriginal
 */
export function Catch<T>(
  $base: EventType<T>,
  errorMessage: TransportType,
  errorOriginal?: TransportType,
) {
  return new TheCatch<T>($base, errorMessage, errorOriginal);
}

class TheCatch<T> implements EventType<T> {
  public constructor(
    private $base: EventType<T>,
    private errorMessage: TransportType,
    private errorOriginal?: TransportType,
  ) {
    ensureEvent($base, "Catch: base");
    ensureTransport(errorMessage, "Catch: errorMessage");
    if (errorOriginal !== undefined) {
      ensureTransport(errorOriginal, "Catch: errorOriginal");
    }
  }

  public event(transport: TransportType<T>) {
    try {
      this.$base.event(transport);
    } catch (e: any) {
      if (e instanceof Error) {
        this.errorMessage.use(e.message);
      } else {
        this.errorMessage.use(e);
      }
      if (this.errorOriginal) {
        this.errorOriginal.use(e);
      }
    }
    return this;
  }
}
