import { O } from "../Owner/Owner";
import { I, Information } from "./Information";

export const applied = <T, R>(base: Information<T>, applier: (v: T) => R) => {
  const info = I((g) => {
    base.value(
      O((v) => {
        g.give(applier(v));
      }),
    );
  });
  info.subInfo(base);

  return info;
};
