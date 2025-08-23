import { From, TheInformation, TheOwner } from "../base";

/**
 * Information to which the function was applied to change the value
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
export class Applied<T, R> extends TheInformation<R> {
  public constructor(
    private baseSrc: TheInformation<T>,
    private applier: (v: T) => R,
  ) {
    super(baseSrc);
  }

  public value(o: TheOwner<R>): this {
    this.baseSrc.value(
      new From((v) => {
        o.give(this.applier(v));
      }),
    );
    return this;
  }
}
