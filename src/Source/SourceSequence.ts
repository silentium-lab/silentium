import { give } from "../Guest/Guest";
import { guestCast } from "../Guest/GuestCast";
import { patronOnce } from "../Guest/PatronOnce";
import { isSource, value } from "./Source";
import { sourceAll } from "./SourceAll";
import { sourceOf, SourceChangeableType } from "./SourceChangeable";
import { subSource } from "../Guest/PatronPool";
import { SourceType } from "../types/SourceType";
import { LazyType } from "../types/LazyType";
import { GuestType } from "../types/GuestType";

/**
 * Ability to apply source to source of array values sequentially
 * @url https://silentium-lab.github.io/silentium/#/source/source-sequence
 */
export const sourceSequence = <T, TG>(
  baseSource: SourceType<T[]>,
  targetSource: LazyType<SourceType<TG>>,
) => {
  if (baseSource === undefined) {
    throw new Error("SourceSequence didn't receive baseSource argument");
  }
  if (targetSource === undefined) {
    throw new Error("SourceSequence didn't receive targetSource argument");
  }

  const src = (guest: GuestType<TG[]>) => {
    const sequenceSource = sourceOf();
    const source = targetSource.get(sequenceSource);
    subSource(sequenceSource, baseSource);

    value(
      baseSource,
      guestCast(guest, (theValue) => {
        let index = 0;

        const sources: SourceChangeableType[] = [];
        theValue.forEach(() => {
          const newSrc = sourceOf();
          sources.push(newSrc);
          subSource(newSrc, baseSource);
        });

        const nextItemHandle = () => {
          if (theValue[index + 1] !== undefined) {
            index = index + 1;
            handle();
          }
        };

        function handle() {
          const currentSource = sources[index];
          const nextValue = theValue[index];
          if (isSource(nextValue)) {
            value(
              nextValue,
              patronOnce((theNextValue) => {
                sequenceSource.give(theNextValue);
                value(source, currentSource);
                nextItemHandle();
              }),
            );
          } else {
            sequenceSource.give(nextValue);
            value(source, currentSource);
            nextItemHandle();
          }
        }

        if (theValue[index] !== undefined) {
          handle();
          value(sourceAll(sources), guest);
        } else {
          give([], guest);
        }
      }),
    );
  };
  subSource(src, baseSource);

  return src;
};
