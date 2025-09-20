import { From, InformationType } from "../base";

export class PrimitiveSource<T> {
  public constructor(
    baseSrc: InformationType<T>,
    private theValue: T | null = null,
  ) {
    baseSrc.value(
      new From((v) => {
        this.theValue = v;
      }),
    );
  }

  public [Symbol.toPrimitive]() {
    return this.theValue;
  }
}
