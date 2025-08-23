import { TheInformation, TheOwner } from "../base";

/**
 * When receiving a reference to a function expecting a callback, the component
 * creates its own callback, and the data received in this callback
 * will become the value of the information object
 * https://silentium-lab.github.io/silentium/#/en/information/from-callback
 */
export class FromCallback<T> extends TheInformation<T> {
  private theArgs: unknown[];

  public constructor(
    private waitForCb: (cb: (v: T) => any, ...args: unknown[]) => unknown,
    ...args: unknown[]
  ) {
    super([waitForCb]);
    this.theArgs = args;
  }

  public value(o: TheOwner<T>): this {
    this.waitForCb(
      (v) => {
        o.give(v);
      },
      ...this.theArgs,
    );
    return this;
  }
}
