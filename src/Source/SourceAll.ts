import {
  firstVisit,
  give,
  guest,
  GuestObjectType,
  GuestType,
} from "../Guest/Guest";
import { guestCast } from "../Guest/GuestCast";
import { systemPatron } from "../Patron/Patron";
import { removePatronFromPools, subSource } from "../Patron/PatronPool";
import { DestroyableType } from "../Source/SourceDestroyable";
import { SourceObjectType, SourceType, value } from "./Source";
import { sourceOf } from "./SourceChangeable";

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
      const keyPatron = systemPatron((v) => {
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
      });
      patrons.push(keyPatron);
      value(source, keyPatron);
    });
  });

  return {
    value(guest: GuestType<ExtractTypesFromArray<T>>) {
      visited();
      const mbPatron = guestCast(guest, (value: T) => {
        if (isAllFilled()) {
          give(Object.values(value) as ExtractTypesFromArray<T>, guest);
        }
      });
      patrons.push(mbPatron);
      theAll.value(mbPatron);
    },
    destroy() {
      patrons.forEach((patron) => {
        removePatronFromPools(patron);
      });
    },
  };
};
