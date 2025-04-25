import { give, GuestType } from "../Guest/Guest";
import { guestCast } from "../Guest/GuestCast";
import { patronOnce } from "../Patron/PatronOnce";
import { PersonalType } from "../Personal/Personal";
import { isSource, SourceType, value } from "./Source";
import { sourceAll } from "./SourceAll";
import { sourceOf, SourceChangeableType } from "./SourceChangeable";

/**
 * Ability to apply source to source of array values sequentially
 * @url https://silentium-lab.github.io/silentium/#/source/source-sequence
 */
export const sourceSequence = <T, TG>(
  baseSource: SourceType<T[]>,
  targetSource: PersonalType<SourceType<TG>>,
) => {
  if (baseSource === undefined) {
    throw new Error("SourceSequence didn't receive baseSource argument");
  }
  if (targetSource === undefined) {
    throw new Error("SourceSequence didn't receive targetSource argument");
  }

  return (guest: GuestType<TG[]>) => {
    const sequenceSource = sourceOf();
    const source = targetSource.get(sequenceSource);

    value(
      baseSource,
      guestCast(guest, (theValue) => {
        let index = 0;

        const sources: SourceChangeableType[] = [];
        theValue.forEach(() => {
          sources.push(sourceOf());
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
};
