import { SourceType } from "../types";
import { shared } from "../components/Shared";

export const sharedSource = <T>(
  baseSrc: SourceType<T>,
  stateless = false,
): SourceType<T> => {
  const sharedSrc = shared(baseSrc.value, stateless);

  return {
    value: (u) => {
      sharedSrc.value(u);
    },
    give: (v) => {
      baseSrc.give(v);
    },
  };
};
