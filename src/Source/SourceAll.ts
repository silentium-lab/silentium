import { withName } from "../utils/Nameable";
import { firstVisit, give, guest } from "../Guest/Guest";
import { guestCast } from "../Guest/GuestCast";
import { systemPatron } from "../Guest/Patron";
import { destroy, removePatronFromPools, subSource } from "../Guest/PatronPool";
import { value } from "./Source";
import { sourceOf } from "./SourceChangeable";
import { DestroyableType } from "../types";
import { SourceObjectType, SourceType } from "../types/SourceType";
import { GuestObjectType } from "../types/GuestType";
import { GuestType } from "../types/GuestType";

type ExtractType<T> = T extends SourceType<infer U> ? U : never;

export type ExtractTypesFromArray<T extends SourceType<any>[]> = {
  [K in keyof T]: ExtractType<T[K]>;
};

/**
 * Represents common value as Array of bunch of sources,
 * when all sources will gets it's values
 * @url https://silentium-lab.github.io/silentium/#/source/source-all
 */
export const sourceAll = <const T extends SourceType[]>(
  sources: T,
): SourceObjectType<ExtractTypesFromArray<T>> & DestroyableType => {
  const keysKnown = new Set<string>(Object.keys(sources));
  const keysFilled = new Set();
  const isAllFilled = () => {
    return keysFilled.size > 0 && keysFilled.size === keysKnown.size;
  };
  const theAll = sourceOf({});
  const patrons: GuestObjectType[] = [];

  const visited = firstVisit(() => {
    Object.entries(sources).forEach(([key, source]) => {
      subSource(theAll, source);
      keysKnown.add(key);
      const keyPatron = withName(
        systemPatron((v) => {
          theAll.value(
            guest((all: Record<string, unknown>) => {
              keysFilled.add(key);
              const lastAll = {
                ...all,
                [key]: v,
              };
              theAll.give(lastAll);
            }),
          );
        }),
        "all_key-patron",
      );
      patrons.push(keyPatron);
      value(source, keyPatron);
    });
  });

  return {
    value(guest: GuestType<ExtractTypesFromArray<T>>) {
      visited();
      const mbPatron = withName(
        guestCast(guest, (value: T) => {
          if (isAllFilled()) {
            give(Object.values(value) as ExtractTypesFromArray<T>, guest);
          }
        }),
        "mb-patron",
      );
      patrons.push(mbPatron);
      theAll.value(mbPatron);
    },
    destroy() {
      patrons.forEach((patron) => {
        removePatronFromPools(patron);
      });
      destroy(theAll);
    },
  };
};
