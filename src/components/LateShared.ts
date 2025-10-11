import { late } from "../components/Late";
import { sharedSource } from "../components/SharedSource";
import { SourceType } from "../types";

export const lateShared = <T>(value?: T): SourceType<T> => {
  return sharedSource(late(value));
};
