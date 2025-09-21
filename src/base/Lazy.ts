import { Destroyable } from "./Destroyable";
import { Of } from "./Of";
import { InformationType } from "./TheInformation";

/**
 * Ability to create information after some event
 */
export class Lazy<T = unknown> extends Destroyable {
  public constructor(
    protected buildFn?: (...args: InformationType[]) => InformationType<T>,
  ) {
    super();
  }

  public get(...args: InformationType[]) {
    args.forEach((dep) => {
      this.addDep(dep);
    });
    return this.buildFn?.(...args) ?? (new Of(null) as InformationType<T>);
  }
}

/**
 * Lazy things
 */
export interface LazyType<R, P extends any[]> {
  get(...args: P): R;
}
