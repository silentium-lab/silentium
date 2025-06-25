import { Owner } from "../Owner";
import { Information } from "./Information";
import { InformationDataType } from "../types/InformationType";

/**
 * A component that allows creating linked objects of information and its owner
 * in such a way that if a new value is assigned to the owner, this value
 * will become the value of the linked information source
 * https://silentium-lab.github.io/silentium/#/en/information/of
 */
export const of = <T>(incomeI?: InformationDataType<T>) => {
  let sharedValue = incomeI as T;
  let relatedO: Owner<T> | undefined;

  const notifyO = () => {
    if (relatedO !== undefined) {
      relatedO.give(sharedValue);
    }
  };

  const info = new Information<T>((g) => {
    relatedO = g;
    if (sharedValue !== undefined && sharedValue !== null) {
      notifyO();
    }
  }, "of");

  return [
    info,
    new Owner<T>((v) => {
      sharedValue = v;
      notifyO();
    }),
  ] as const;
};
