import { give, Guest, GuestObjectType, GuestType } from "../Guest/Guest";
import { GuestCast } from "../Guest/GuestCast";
import { Patron } from "../Patron/Patron";
import { SourceObjectType, SourceType, value } from "./Source";
import { SourceChangeable } from "./SourceChangeable";

export interface SourceAllType<T = any> extends SourceObjectType<T> {
  valueArray(guest: GuestObjectType<T>): this;
  guestKey<R>(key: string): GuestObjectType<R>;
}

/**
 * @url https://silentium-lab.github.io/silentium/#/source/source-all
 */
export const sourceAll = <T>(
  sources: SourceType<T>[] | Record<string, SourceType<T>>,
) => {
  const keysKnown = new Set<string>(Object.keys(sources));
  const keysFilled = new Set();
  const isAllFilled = () => {
    return keysFilled.size > 0 && keysFilled.size === keysKnown.size;
  };
  const isSourcesArray = Array.isArray(sources);
  const theAll = new SourceChangeable<Record<string, unknown>>({});

  Object.entries(sources).forEach(([key, source]) => {
    keysKnown.add(key);
    value(
      source,
      new Patron((v) => {
        theAll.value(
          new Guest((all: Record<string, unknown>) => {
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
        new GuestCast(g, (value) => {
          if (isAllFilled()) {
            give((isSourcesArray ? Object.values(value) : value) as T, g);
          }
        }),
      );
    }, guest);
  };
};
