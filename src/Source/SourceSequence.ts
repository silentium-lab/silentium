import { SourceChangeable } from "./SourceChangeable";
import { give, GuestType } from "../Guest/Guest";
import { GuestCast } from "../Guest/GuestCast";
import { PatronOnce } from "../Patron/PatronOnce";
import { PrivateType } from "../Private/Private";
import { isSource, SourceObjectType, SourceType, value } from "./Source";
import { SourceAll } from "./SourceAll";

/**
 * @url https://silentium-lab.github.io/silentium/#/source/source-sequence
 */
export class SourceSequence<T, TG> implements SourceObjectType<TG[]> {
  public constructor(
    private baseSource: SourceType<T[]>,
    private targetSource: PrivateType<SourceType<TG>>,
  ) {
    if (baseSource === undefined) {
      throw new Error("SourceSequence didnt receive baseSource argument");
    }
    if (targetSource === undefined) {
      throw new Error("SourceSequence didnt receive targetSource argument");
    }
  }

  public value(guest: GuestType<TG[]>) {
    const all = new SourceAll<TG[]>();
    const sequenceSource = new SourceChangeable();
    const targetSource = this.targetSource.get(sequenceSource);

    value(
      this.baseSource,
      new GuestCast(guest, (theValue) => {
        let index = 0;

        const nextItemHandle = () => {
          if (theValue[index + 1] !== undefined) {
            index = index + 1;
            handle();
          } else {
            all.valueArray(guest);
          }
        };

        function handle() {
          sequenceSource.give(null);
          const nextValue = theValue[index];
          if (isSource(nextValue)) {
            value(
              nextValue,
              new PatronOnce((theNextValue) => {
                sequenceSource.give(theNextValue);
                value(targetSource, all.guestKey(index.toString()));
                nextItemHandle();
              }),
            );
          } else {
            sequenceSource.give(nextValue);
            value(targetSource, all.guestKey(index.toString()));
            nextItemHandle();
          }
        }

        if (theValue[index] !== undefined) {
          handle();
        } else {
          give([], guest);
        }
      }),
    );
    return this;
  }
}
