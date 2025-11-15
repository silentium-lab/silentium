import { ensureMessage, ensureTransport } from "helpers/ensures";
import { MessageType } from "types/MessageType";
import { TransportType } from "types/TransportType";

/**
 * An message representing a base message where
 * its operation is wrapped in try-catch
 * and expects exceptions. If an exception
 * bubbles up, it's passed to the transports
 * as errorMessage and errorOriginal
 */
export function Catch<T>(
  $base: MessageType<T>,
  errorMessage: TransportType,
  errorOriginal?: TransportType,
) {
  return new CatchImpl<T>($base, errorMessage, errorOriginal);
}

export class CatchImpl<T> implements MessageType<T> {
  public constructor(
    private $base: MessageType<T>,
    private errorMessage: TransportType,
    private errorOriginal?: TransportType,
  ) {
    ensureMessage($base, "Catch: base");
    ensureTransport(errorMessage, "Catch: errorMessage");
    if (errorOriginal !== undefined) {
      ensureTransport(errorOriginal, "Catch: errorOriginal");
    }
  }

  public to(transport: TransportType<T>) {
    try {
      this.$base.to(transport);
    } catch (e: unknown) {
      if (e instanceof Error) {
        this.errorMessage.use(e.message);
      } else {
        this.errorMessage.use(String(e));
      }
      if (this.errorOriginal) {
        this.errorOriginal.use(e);
      }
    }
    return this;
  }
}
