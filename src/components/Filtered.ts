import { From, TheInformation, TheOwner } from "../base";

/**
 * Information whose value is being validated
 * via a predicate; if the predicate returns true, the value
 * can be passed to the output
 * https://silentium-lab.github.io/silentium/#/en/information/filtered
 */
export class Filtered<T> extends TheInformation<T> {
  public constructor(
    private baseSrc: TheInformation<T>,
    private predicate: (v: T) => boolean,
    private defaultValue?: T,
  ) {
    super(baseSrc);
  }

  public value(o: TheOwner<T>): this {
    this.baseSrc.value(
      new From((v) => {
        if (this.predicate(v)) {
          o.give(v);
        } else if (this.defaultValue !== undefined) {
          o.give(this.defaultValue);
        }
      }),
    );
    return this;
  }
}
