import { isFilled } from "../helpers";
import { InformationType, OwnerType } from "../types";

/**
 * A component that allows creating linked objects of information and its owner
 * in such a way that if a new value is assigned to the owner, this value
 * will become the value of the linked information source
 * https://silentium-lab.github.io/silentium/#/en/information/of
 */
export const of = <T>(sharedValue?: T) => {
  let relatedO: OwnerType<T> | undefined;

  const notifyO = () => {
    if (relatedO !== undefined && isFilled(sharedValue)) {
      relatedO(sharedValue);
    }
  };

  const info = <InformationType<T>>((o) => {
    relatedO = o;
    notifyO();
  });

  return [
    info,
    (v: T) => {
      sharedValue = v;
      notifyO();
    },
  ] as const;
};
