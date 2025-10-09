import { DataType, DataUserType } from "../types";

/**
 * Component that gets a value from a promise and
 * presents it as information
 * https://silentium-lab.github.io/silentium/#/en/information/from-promise
 */
export const fromPromise = <T>(
  p: Promise<T>,
  errorOwner?: DataUserType,
): DataType<T> => {
  return function FromPromiseData(u) {
    p.then(function FromPromiseThen(v) {
      u(v);
    }).catch(function FromPromiseCatch(e) {
      errorOwner?.(e);
    });
  };
};
