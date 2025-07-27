import { InformationType } from "../types";
import { of } from "./Of";

/**
 * Component that gets a value from a promise and
 * presents it as information
 * https://silentium-lab.github.io/silentium/#/en/information/from-promise
 */
export const fromPromise = <T>(
  p: Promise<T>,
): [InformationType<T>, InformationType] => {
  const [errorInf, errorOwn] = of();

  return [
    (own) => {
      p.then((v) => {
        own(v);
      }).catch((e) => {
        errorOwn(e);
      });
    },
    errorInf,
  ];
};
