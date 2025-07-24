import { InformationType } from "../types/InformationType";

export const i =
  <T>(v: T): InformationType<T> =>
  (o) => {
    o(v);
  };
