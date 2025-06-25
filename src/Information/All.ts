import { Owner } from "../Owner/Owner";
import { InformationType } from "../types/InformationType";
import { Information } from "./Information";

type ExtractType<T> = T extends InformationType<infer U> ? U : never;
type ExtractTypeS<T> = T extends Information<infer U> ? U : never;

export type ExtractTypesFromArray<T extends InformationType<any>[]> = {
  [K in keyof T]: ExtractType<T[K]>;
};

export type ExtractTypesFromArrayS<T extends Information<any>[]> = {
  [K in keyof T]: ExtractTypeS<T[K]>;
};

/**
 * Combines multiple information sources into a single unified source
 * represented as an array containing values from all sources
 * https://silentium-lab.github.io/silentium/#/en/information/all
 */
export const all = <const T extends Information[]>(...infos: T) => {
  const i = new Information<ExtractTypesFromArrayS<T>>((g) => {
    const keysKnown = new Set<string>(Object.keys(infos));
    const keysFilled = new Set();
    const isAllFilled = () => {
      return keysFilled.size > 0 && keysFilled.size === keysKnown.size;
    };
    const result: Record<string, unknown> = {};

    Object.entries(infos).forEach(([key, info]) => {
      i.subInfo(info);
      keysKnown.add(key);
      info.value(
        new Owner((v) => {
          keysFilled.add(key);
          result[key] = v;
          if (isAllFilled()) {
            g.give(Object.values(result) as ExtractTypesFromArrayS<T>);
          }
        }),
      );
    });
  });

  return i;
};
