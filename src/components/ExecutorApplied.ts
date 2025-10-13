import { EventType, EventUserType } from "../types";

/**
 * Information to which a function is applied in order
 * to control the value passing process
 * https://silentium-lab.github.io/silentium/#/en/information/applied
 */
export function ExecutorApplied<T>(
  baseEv: EventType<T>,
  applier: (executor: EventUserType<T>) => EventUserType<T>,
): EventType<T> {
  return function ExecutorAppliedEvent(u) {
    const ExecutorAppliedBaseUser = applier(u);
    baseEv(ExecutorAppliedBaseUser);
  };
}
