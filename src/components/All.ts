import { DataType } from "../types";

type ExtractTypeS<T> = T extends DataType<infer U> ? U : never;

export type ExtractTypesFromArrayS<T extends DataType<any>[]> = {
  [K in keyof T]: ExtractTypeS<T[K]>;
};

const isAllFilled = (keysFilled: Set<string>, keysKnown: Set<string>) => {
  return keysFilled.size > 0 && keysFilled.size === keysKnown.size;
};

/**
 * Combines multiple information sources into a single unified source
 * represented as an array containing values from all sources
 * https://silentium-lab.github.io/silentium/#/en/information/all
 */
export const all = <const T extends DataType[]>(
  ...theInfos: T
): DataType<ExtractTypesFromArrayS<T>> => {
  const keysKnown = new Set<string>(Object.keys(theInfos));
  const keysFilled = new Set<string>();

  return (u) => {
    const result: Record<string, unknown> = {};

    Object.entries(theInfos).forEach(([key, info]) => {
      keysKnown.add(key);
      info((v) => {
        keysFilled.add(key);
        result[key] = v;
        if (isAllFilled(keysFilled, keysKnown)) {
          u(Object.values(result) as ExtractTypesFromArrayS<T>);
        }
      });
    });
  };
};
