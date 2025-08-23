import { Lazy, TheInformation } from "../base";

/**
 * Lazy with applied function to its results
 */
export class LazyApplied<T> extends Lazy<T> {
  public constructor(
    private baseLazy: Lazy,
    private applier: (i: TheInformation) => TheInformation<T>,
  ) {
    super();
  }

  public get(...args: TheInformation[]): TheInformation<T> {
    return this.applier(this.baseLazy.get(...args));
  }
}
