import { DataType } from "../types";

export const of = <T>(v: T): DataType<T> =>
  function Of(u) {
    return u(v);
  };
