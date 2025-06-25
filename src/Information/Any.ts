import { I, Information } from "./Information";

/**
 * From a set of information sources we get
 * a common response from any source for a single owner
 * https://silentium-lab.github.io/silentium/#/en/information/any
 */
export const any = <T>(...infos: Information<T>[]) => {
  const info = I((g) => {
    infos.forEach((info) => {
      info.value(g);
      info.subInfo(info);
    });
  });

  return info;
};
