import { subSource } from "../Patron/PatronPool";
import { give, guest, GuestType } from "../Guest/Guest";
import { guestCast } from "../Guest/GuestCast";
import { patron } from "../Patron/Patron";
import { SourceType, value } from "./Source";
import { sourceChangeable } from "./SourceChangeable";

/**
 * Represents common value as Record or Array of bunch of sources,
 * when all sources will gets it's values
 * @url https://silentium-lab.github.io/silentium/#/source/source-all
 */
export const sourceAll = <T>(
  sources: SourceType<any>[] | Record<string, SourceType<any>>,
) => {
  const keysKnown = new Set<string>(Object.keys(sources));
  const keysFilled = new Set();
  const isAllFilled = () => {
    return keysFilled.size > 0 && keysFilled.size === keysKnown.size;
  };
  const isSourcesArray = Array.isArray(sources);
  const theAll = sourceChangeable<Record<string, unknown>>({});

  Object.entries(sources).forEach(([key, source]) => {
    subSource(source, theAll);
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

  return (guest: GuestType<T>) => {
    value((g) => {
      theAll.value(
        guestCast(g, (value) => {
          if (isAllFilled()) {
            give((isSourcesArray ? Object.values(value) : value) as T, g);
          }
        }),
      );
    }, guest);
  };
};
