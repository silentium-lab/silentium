import { TheInformation, TheOwner } from "../base";

/**
 * Component that gets a value from a promise and
 * presents it as information
 * https://silentium-lab.github.io/silentium/#/en/information/from-promise
 */
export class FromPromise<T> extends TheInformation<T> {
  public constructor(
    private p: Promise<T>,
    private errorOwner?: TheOwner,
  ) {
    super(p);
  }

  public value(o: TheOwner<T>): this {
    this.p
      .then((v) => {
        o.give(v);
      })
      .catch((e) => {
        this.errorOwner?.give(e);
      });
    return this;
  }
}
