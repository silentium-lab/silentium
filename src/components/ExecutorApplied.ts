import { From, TheInformation, TheOwner } from "../base";

/**
 * Information to which a function is applied in order
 * to control the value passing process
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
export class ExecutorApplied<T> extends TheInformation<T> {
  public constructor(
    private baseSrc: TheInformation<T>,
    private applier: (executor: (v: T) => void) => (v: T) => void,
  ) {
    super(baseSrc);
  }

  public value(o: TheOwner<T>): this {
    this.baseSrc.value(
      new From(
        this.applier((v) => {
          o.give(v);
        }),
      ),
    );
    return this;
  }
}
