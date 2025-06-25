import { I, Information } from "../Information";
import { O } from "../Owner";

/**
 * Component that receives a data array and yields values one by one
 * https://silentium-lab.github.io/silentium/#/en/information/stream
 */
export const stream = <T>(base: Information<T[]>): Information<T> => {
  const i = I<T>((o) => {
    base.value(
      O((v) => {
        v.forEach((cv) => {
          o.give(cv);
        });
      }),
    );
  });

  return i;
};
