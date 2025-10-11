import { SourceType } from "../types";
import { shared } from "../components/Shared";

export const sharedSource = <T>(
  baseEv: SourceType<T>,
  stateless = false,
): SourceType<T> => {
  const sharedEv = shared(baseEv.event, stateless);

  return {
    event: function SharedSourceEvent(u) {
      sharedEv.event(u);
    },
    use: function SharedSourceUser(v) {
      sharedEv.touched();
      baseEv.use(v);
    },
  };
};
