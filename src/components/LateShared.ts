import { Late } from "../components/Late";
import { SharedSource } from "../components/SharedSource";
import { SourceType } from "../types";

export function LateShared<T>(value?: T): SourceType<T> {
  return SharedSource(Late(value));
}
