import { give, GuestType } from "../Guest/Guest";
import { GuestCast } from "../Guest/GuestCast";
import { PatronOnce } from "../Patron/PatronOnce";
import { PrivateType } from "../Private/Private";
import { isSource, SourceObjectType, SourceType, value } from "./Source";
import { sourceAll } from "./SourceAll";
import { sourceChangeable, SourceChangeableType } from "./SourceChangeable";

/**
 * @url https://silentium-lab.github.io/silentium/#/source/source-sequence
 */
export class SourceSequence<T, TG> implements SourceObjectType<TG[]> {
  public constructor(
    private baseSource: SourceType<T[]>,
    private targetSource: PrivateType<SourceType<TG>>,
  ) {
    if (baseSource === undefined) {
      throw new Error("SourceSequence didn't receive baseSource argument");
    }
    if (targetSource === undefined) {
      throw new Error("SourceSequence didn't receive targetSource argument");
    }
  }

  public value(guest: GuestType<TG[]>) {
    const sequenceSource = sourceChangeable();
    const targetSource = this.targetSource.get(sequenceSource);

    value(
      this.baseSource,
      new GuestCast(guest, (theValue) => {
        let index = 0;

        const sources: SourceChangeableType[] = [];
        theValue.forEach(() => {
          sources.push(sourceChangeable());
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
              new PatronOnce((theNextValue) => {
                sequenceSource.give(theNextValue);
                value(targetSource, currentSource);
                nextItemHandle();
              }),
            );
          } else {
            sequenceSource.give(nextValue);
            value(targetSource, currentSource);
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
    return this;
  }
}
