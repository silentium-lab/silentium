import { InformationType } from "../types";

type ExtractTypeS<T> = T extends InformationType<infer U> ? U : never;

export type ExtractTypesFromArrayS<T extends InformationType<any>[]> = {
  [K in keyof T]: ExtractTypeS<T[K]>;
};

/**
 * Combines multiple information sources into a single unified source
 * represented as an array containing values from all sources
 * https://silentium-lab.github.io/silentium/#/en/information/all
 */
export const all = <const T extends InformationType[]>(
  ...infos: T
): InformationType<ExtractTypesFromArrayS<T>> => {
  return (g) => {
    const keysKnown = new Set<string>(Object.keys(infos));
    const keysFilled = new Set();
    const isAllFilled = () => {
      return keysFilled.size > 0 && keysFilled.size === keysKnown.size;
    };
    const result: Record<string, unknown> = {};

    Object.entries(infos).forEach(([key, info]) => {
      keysKnown.add(key);
      info((v) => {
        keysFilled.add(key);
        result[key] = v;
        if (isAllFilled()) {
          g(Object.values(result) as ExtractTypesFromArrayS<T>);
        }
      });
    });

    return () => {
      keysKnown.clear();
      keysFilled.clear();
    };
  };
};
