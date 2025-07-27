import { onExecuted } from "../helpers";
import { InformationType, OwnerType } from "../types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Last<T extends any[]> = T extends [...infer U, infer L] ? L : never;

/**
 * The set of information sources forms a sequential chain where each source provides
 * an answer. The final answer will be the output result. If any source in the chain
 * provides a new answer, the component's overall response will be repeated.
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
export const chain = <T extends InformationType[]>(...infos: T): Last<T> => {
  let theOwner: OwnerType<Last<T>> | undefined;
  let lastValue: Last<T> | undefined;
  const respondedI = new WeakMap();

  const handleI = (index: number) => {
    const info = infos[index] as InformationType<Last<T>>;
    const nextI = infos[index + 1] as InformationType<Last<T>> | undefined;

    info((v) => {
      if (!nextI) {
        lastValue = v;
        theOwner?.(v);
      }

      if (nextI && lastValue !== undefined && theOwner !== undefined) {
        theOwner?.(lastValue);
      }

      if (nextI && !respondedI.has(info)) {
        handleI(index + 1);
      }

      respondedI.set(info, 1);
    });
  };

  const executed = onExecuted((g) => {
    theOwner = g;
    handleI(0);
  });

  const info = <Last<T>>((g) => {
    executed(g);
    theOwner = g;
  });

  return info;
};
