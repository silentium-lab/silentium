import { DataTypeValue } from "../types/DataType";
import { DataType } from "../types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Last<T extends any[]> = T extends [...infer _, infer L] ? L : never;

/**
 * The set of information sources forms a sequential chain where each source provides
 * an answer. The final answer will be the output result. If any source in the chain
 * provides a new answer, the component's overall response will be repeated.
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
export const chain = <T extends DataType[]>(...infos: T): Last<T> => {
  return <Last<T>>function ChainData(u) {
    let lastValue: DataTypeValue<Last<T>> | undefined;

    const handleI = (index: number) => {
      const info = infos[index] as Last<T>;
      const nextI = infos[index + 1] as Last<T> | undefined;

      info(function ChainItemUser(v) {
        if (!nextI) {
          lastValue = v as DataTypeValue<Last<T>>;
        }

        if (lastValue) {
          u(lastValue);
        }

        if (nextI && !lastValue) {
          handleI(index + 1);
        }
      });
    };

    handleI(0);
  };
};
