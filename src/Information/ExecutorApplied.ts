import { Owner } from "../Owner/Owner";
import { Information } from "./Information";

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
