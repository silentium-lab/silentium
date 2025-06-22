import { Guest } from "../Guest";
import { Source } from "../Source/Source";
import { SourceDataType } from "../types/SourceType";

export const of = <T>(incomeSource?: SourceDataType<T>) => {
  let sharedValue = incomeSource as T;
  let relatedGuest: Guest<T> | undefined;

  const notifyGuest = () => {
    if (relatedGuest !== undefined) {
      relatedGuest.give(sharedValue);
    }
  };

  const source = new Source<T>((g) => {
    relatedGuest = g;
    if (sharedValue !== undefined && sharedValue !== null) {
      notifyGuest();
    }
  });

  return [
    source,
    new Guest<T>((v) => {
      sharedValue = v;
      notifyGuest();
    }),
  ] as const;
};
