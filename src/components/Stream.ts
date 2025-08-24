import { From, InformationType, OwnerType, TheInformation } from "../base";

/**
 * Component that receives a data array and yields values one by one
 * https://silentium-lab.github.io/silentium/#/en/information/stream
 */
export class Stream<T> extends TheInformation<T> {
  public constructor(private baseSrc: InformationType<T[]>) {
    super(baseSrc);
  }

  public value(o: OwnerType<T>): this {
    this.baseSrc.value(
      new From((v) => {
        v.forEach((cv) => {
          o.give(cv);
        });
      }),
    );
    return this;
  }
}
