import { InformationType } from "../types";

export const i =
  <T>(v: T): InformationType<T> =>
  (o) => {
    return o(v);
  };
