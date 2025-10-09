import { DataType } from "../types";

export const of = <T>(v: T): DataType<T> =>
  function OfData(u) {
    return u(v);
  };
