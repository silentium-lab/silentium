import { SourceType } from "../types";
import { Shared } from "../components/Shared";

export function SharedSource<T>(
  baseEv: SourceType<T>,
  stateless = false,
): SourceType<T> {
  const sharedEv = Shared(baseEv.event, stateless);

  return {
    event: function SharedSourceEvent(user) {
      sharedEv.event(user);
    },
    use: function SharedSourceUser(v) {
      sharedEv.touched();
      baseEv.use(v);
    },
  };
}
