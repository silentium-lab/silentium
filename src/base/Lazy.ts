import { Destroyable } from "./Destroyable";
import { Of } from "./Of";
import { TheInformation } from "./TheInformation";

/**
 * Ability to create information after some event
 */
export class Lazy<T = unknown> extends Destroyable {
  public constructor(
    protected buildFn?: (...args: TheInformation[]) => TheInformation<T>,
  ) {
    super();
  }

  public get(...args: TheInformation[]) {
    args.forEach((dep) => {
      this.addDep(dep);
    });
    return this.buildFn?.(...args) ?? (new Of(null) as TheInformation<T>);
  }
}
