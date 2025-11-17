import { ensureMessage, ensureTap } from "helpers/ensures";
import { MessageType } from "types/MessageType";
import { TapType } from "types/TapType";

/**
 * An message representing a base message where
 * its operation is wrapped in try-catch
 * and expects exceptions. If an exception
 * bubbles up, it's passed to the taps
 * as errorMessage and errorOriginal
 */
export function Catch<T>(
  $base: MessageType<T>,
  errorMessage: TapType,
  errorOriginal?: TapType,
) {
  return new CatchImpl<T>($base, errorMessage, errorOriginal);
}

export class CatchImpl<T> implements MessageType<T> {
  public constructor(
    private $base: MessageType<T>,
    private errorMessage: TapType,
    private errorOriginal?: TapType,
  ) {
    ensureMessage($base, "Catch: base");
    ensureTap(errorMessage, "Catch: errorMessage");
    if (errorOriginal !== undefined) {
      ensureTap(errorOriginal, "Catch: errorOriginal");
    }
  }

  public pipe(tap: TapType<T>) {
    try {
      this.$base.pipe(tap);
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
