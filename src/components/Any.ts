import { InformationType, OwnerType, TheInformation } from "../base";

/**
 * From a set of information sources we get
 * a common response from any source for a single owner
 * https://silentium-lab.github.io/silentium/#/en/information/any
 */
export class Any<T> extends TheInformation<T> {
  private infos: InformationType<T>[];

  public constructor(...theInfos: InformationType<T>[]) {
    super(theInfos);
    this.infos = theInfos;
  }

  public value(o: OwnerType<T>): this {
    this.infos.forEach((info) => {
      info.value(o);
    });
    return this;
  }
}
