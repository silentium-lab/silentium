import { give, GuestType } from "../Guest/Guest";
import { guestCast } from "../Guest/GuestCast";
import { SourceType, value } from "./Source";

/**
 * Connects guest with source what give response faster than others
 * @url https://silentium-lab.github.io/silentium/#/source/source-race
 */
export const sourceRace = <T>(sources: SourceType<T>[]) => {
  if (sources === undefined) {
    throw new Error("SourceRace didnt receive sources argument");
  }

  return (guest: GuestType<T>) => {
    let connectedWithSource: SourceType | null = null;
    sources.forEach((source) => {
      value(
        source,
        guestCast(<GuestType>guest, (value) => {
          if (!connectedWithSource || connectedWithSource === source) {
            give(value as T, guest);
            connectedWithSource = source;
          }
        }),
      );
    });
  };
};
