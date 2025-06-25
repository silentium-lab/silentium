import { O, Owner } from "../Owner/Owner";
import { I, Information } from "./Information";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Last<T extends any[]> = T extends [...infer U, infer L] ? L : never;

/**
 * The set of information sources forms a sequential chain where each source provides
 * an answer. The final answer will be the output result. If any source in the chain
 * provides a new answer, the component's overall response will be repeated.
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
export const chain = <T extends Information[]>(
  ...infos: T
): Information<Last<T>> => {
  let theOwner: Owner<Last<T>> | undefined;
  let lastValue: Last<T> | undefined;
  const respondedI = new WeakMap();

  const handleI = (index: number) => {
    const info = infos[index];
    const nextI = infos[index + 1];

    info.value(
      O((v) => {
        if (!nextI) {
          lastValue = v;
          theOwner?.give(v);
        }

        if (nextI && lastValue !== undefined && theOwner !== undefined) {
          theOwner.give(lastValue);
        }

        if (nextI && !respondedI.has(info)) {
          handleI(index + 1);
        }

        respondedI.set(info, 1);
      }),
    );
  };

  const info = I<Last<T>>((g) => {
    theOwner = g;
  });

  info.executed(() => {
    handleI(0);
  });

  return info;
};
