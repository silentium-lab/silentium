import { Owner } from "../Owner/Owner";
import { Information } from "./Information";

/**
 * Information to which a function is applied in order
 * to control the value passing process
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
export const executorApplied = <T>(
  base: Information<T>,
  applier: (executor: Owner<T>) => Owner<T>,
) => {
  const i = new Information<T>((g) => {
    base.value(applier(g));
  });
  i.subInfo(base);

  return i;
};
