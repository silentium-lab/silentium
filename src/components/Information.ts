import { InformationType } from "../types";

export const i =
  <T>(v: T): InformationType<T> =>
  (o) => {
    o(v);
  };
