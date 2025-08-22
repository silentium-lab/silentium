import { Destroyable } from "./Destroyable";
import { Of } from "./Of";
import { TheInformation } from "./TheInformation";

/**
 * Ability to create information after some event
 */
export class Lazy<T = unknown> extends Destroyable {
  public constructor(
    protected buildFn?: (...args: unknown[]) => TheInformation<T>,
  ) {
    super();
  }

  public get(...args: unknown[]) {
    return this.buildFn?.(...args) ?? new Of(null);
  }
}
