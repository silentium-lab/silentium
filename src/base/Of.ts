import { DataType } from "../types";

export const of =
  <T>(v: T): DataType<T> =>
  (u) =>
    u(v);
