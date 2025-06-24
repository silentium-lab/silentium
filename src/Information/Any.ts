import { I, Information } from "./Information";

export const any = <T>(...infos: Information<T>[]) => {
  const info = I((g) => {
    infos.forEach((info) => {
      info.value(g);
      info.subInfo(info);
    });
  });

  return info;
};
