import { I, Information } from "../Information/Information";

/**
 * Component that gets a value from a promise and
 * presents it as information
 * https://silentium-lab.github.io/silentium/#/en/information/from-promise
 */
export const fromPromise = <T>(p: Promise<T>): Information<T> => {
  return I((o) => {
    p.then((v) => {
      o.give(v);
    }).catch((e) => {
      o.error(e);
    });
  });
};
