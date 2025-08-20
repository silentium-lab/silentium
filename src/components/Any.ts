import { TheInformation, TheOwner } from "../base";

/**
 * From a set of information sources we get
 * a common response from any source for a single owner
 * https://silentium-lab.github.io/silentium/#/en/information/any
 */
export class Any<T> extends TheInformation<T> {
  private infos: TheInformation<T>[];

  public constructor(...theInfos: TheInformation<T>[]) {
    super(theInfos);
    this.infos = theInfos;
  }

  public value(o: TheOwner<T>): this {
    this.infos.forEach((info) => {
      info.value(o);
    });
    return this;
  }
}
