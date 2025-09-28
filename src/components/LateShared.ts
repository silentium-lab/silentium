import { late } from "../components/Late";
import { sharedSource } from "../components/SharedSource";
import { SourceType } from "../types";

export const lateShared = <T>(theValue?: T): SourceType<T> => {
  const src = sharedSource(late(theValue));
  return {
    value: src.value,
    give: src.give,
  };
};
