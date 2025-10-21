import { EventType, EventUserType } from "src/types";

/**
 * Catches exception and passes
 * exception content to error user
 */
export function Catch<T>(
  $base: EventType<T>,
  error: EventUserType,
  errorOriginal?: EventUserType,
): EventType<T> {
  return (user) => {
    try {
      $base(user);
    } catch (e: any) {
      if (e instanceof Error) {
        error(e.message);
      } else {
        error(e);
      }
      if (errorOriginal) {
        errorOriginal(e);
      }
    }
  };
}
