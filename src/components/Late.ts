import { EventUserType, SourceType } from "../types";
import { isFilled } from "../helpers";

/**
 * A component that allows creating linked objects of information and its owner
 * in such a way that if a new value is assigned to the owner, this value
 * will become the value of the linked information source
 * https://silentium-lab.github.io/silentium/#/en/information/of
 */
export function Late<T>(v?: T): SourceType<T> {
  let lateUser: EventUserType<T> | null = null;
  const notify = (v?: T) => {
    if (isFilled(v) && lateUser) {
      lateUser(v);
    }
  };

  return {
    event: function LateEvent(user) {
      if (lateUser) {
        throw new Error(
          "Late component gets new user, when another was already connected!",
        );
      }

      lateUser = user;
      notify(v);
    },
    use: function LateUser(v) {
      notify(v);
    },
  };
}
