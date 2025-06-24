import { Owner } from "../Owner";
import { Information } from "./Information";
import { InformationDataType } from "../types/InformationType";

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
