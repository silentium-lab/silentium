import { From, TheInformation, TheOwner } from "../base";

/**
 * Limits the number of values from the information source
 * to a single value - once the first value is emitted, no more
 * values are delivered from the source
 * https://silentium-lab.github.io/silentium/#/en/information/once
 */
export class Once<T> extends TheInformation<T> {
  public constructor(private baseSrc: TheInformation<T>) {
    super();
  }

  public value(o: TheOwner<T>): this {
    let isFilled = false;
    this.baseSrc.value(
      new From((v) => {
        if (!isFilled) {
          isFilled = true;
          o.give(v);
        }
      }),
    );
    return this;
  }
}
