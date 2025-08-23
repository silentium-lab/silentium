import { From, TheInformation, TheOwner } from "../base";

/**
 * A component that takes one value at a time and returns
 * an array of all previous values
 * https://silentium-lab.github.io/silentium/#/en/information/sequence
 */
export class Sequence<T> extends TheInformation<T[]> {
  public constructor(private baseSrc: TheInformation<T>) {
    super(baseSrc);
  }

  public value(o: TheOwner<T[]>): this {
    const result: T[] = [];
    this.baseSrc.value(
      new From((v) => {
        result.push(v);
        o.give(result);
      }),
    );
    return this;
  }
}
