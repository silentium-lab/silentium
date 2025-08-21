import { From, TheInformation, TheOwner } from "../base";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Last<T extends any[]> = T extends [...infer U, infer L] ? L : never;

/**
 * The set of information sources forms a sequential chain where each source provides
 * an answer. The final answer will be the output result. If any source in the chain
 * provides a new answer, the component's overall response will be repeated.
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
export class Chain<T extends TheInformation[]> extends TheInformation<Last<T>> {
  private theInfos: T;

  public constructor(...infos: T) {
    super(infos);
    this.theInfos = infos;
  }

  public value(o: TheOwner<Last<T>>) {
    let lastValue: Last<T> | undefined;

    const handleI = (index: number) => {
      const info = this.theInfos[index] as TheInformation<Last<T>>;
      const nextI = this.theInfos[index + 1] as
        | TheInformation<Last<T>>
        | undefined;

      info.value(
        new From((v) => {
          if (!nextI) {
            lastValue = v;
          }

          if (nextI && !lastValue) {
            handleI(index + 1);
          }

          if (lastValue) {
            o.give(lastValue);
          }
        }),
      );
    };

    handleI(0);

    return this;
  }
}
