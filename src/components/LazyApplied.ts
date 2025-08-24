import { InformationType, Lazy } from "../base";

/**
 * Lazy with applied function to its results
 */
export class LazyApplied<T> extends Lazy<T> {
  public constructor(
    private baseLazy: Lazy,
    private applier: (i: InformationType) => InformationType<T>,
  ) {
    super();
  }

  public get(...args: InformationType[]): InformationType<T> {
    return this.applier(this.baseLazy.get(...args));
  }
}
