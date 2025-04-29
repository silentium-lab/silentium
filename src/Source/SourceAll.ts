import { subSource } from "../Patron/PatronPool";
import { give, guest, GuestType } from "../Guest/Guest";
import { guestCast } from "../Guest/GuestCast";
import { patron } from "../Patron/Patron";
import { SourceType, value } from "./Source";
import { sourceOf } from "./SourceChangeable";

type ExtractType<T> = T extends SourceType<infer U> ? U : never;

type ExtractTypesFromArray<T extends SourceType<any>[]> = {
  [K in keyof T]: ExtractType<T[K]>;
};

/**
 * Represents common value as Array of bunch of sources,
 * when all sources will gets it's values
 * @url https://silentium-lab.github.io/silentium/#/source/source-all
 */
export const sourceAll = <const T extends SourceType[]>(
  sources: T,
): SourceType<ExtractTypesFromArray<T>> => {
  const keysKnown = new Set<string>(Object.keys(sources));
  const keysFilled = new Set();
  const isAllFilled = () => {
    return keysFilled.size > 0 && keysFilled.size === keysKnown.size;
  };
  const theAll = sourceOf({});

  Object.entries(sources).forEach(([key, source]) => {
    subSource(theAll, source);
    keysKnown.add(key);
    value(
      source,
      patron((v) => {
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
    );
  });

  return (guest: GuestType<ExtractTypesFromArray<T>>) => {
    value((g) => {
      theAll.value(
        guestCast(g, (value) => {
          if (isAllFilled()) {
            give(Object.values(value) as ExtractTypesFromArray<T>, g);
          }
        }),
      );
    }, guest);
  };
};
