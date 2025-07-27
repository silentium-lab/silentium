import { InformationType } from "../types";

/**
 * Component that receives a data array and yields values one by one
 * https://silentium-lab.github.io/silentium/#/en/information/stream
 */
export const stream = <T>(base: InformationType<T[]>): InformationType<T> => {
  return (o) => {
    base((v) => {
      v.forEach((cv) => {
        o(cv);
      });
    });
  };
};
