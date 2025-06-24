import { O } from "../Owner";
import { Information } from "./Information";

export const once = <T>(base: Information<T>) => {
  const info = new Information<T>((g) => {
    let isFilled = false;
    base.value(
      O((v) => {
        if (!isFilled) {
          isFilled = true;
          g.give(v);
        }
      }),
    );
  });
  info.subInfo(base);

  return info;
};
