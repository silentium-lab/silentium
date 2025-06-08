import { give, GuestType } from "../Guest/Guest";
import { GuestDisposableType } from "../Guest/GuestDisposable";

export type PatronType<T> = GuestDisposableType<T> & {
  introduction(): "patron";
};

/**
 * Patron may have priority information
 * @url https://silentium-lab.github.io/silentium/#/en/terminology/priority
 */
export interface PatronWithPriority {
  priority(): number;
}

/**
 * @url https://silentium-lab.github.io/silentium/#/en/utils/patron-priority
 */
export const patronPriority = (g: GuestType | PatronWithPriority) => {
  let priority = 100;

  if ("priority" in g && typeof g.priority === "function") {
    priority = g.priority();
  }

  return priority;
};

/**
 * Helps to check what incoming object is patron
 * @url https://silentium-lab.github.io/silentium/#/utils/is-patron
 */
export const isPatron = (guest: GuestType): guest is PatronType<unknown> =>
  typeof guest === "object" &&
  guest !== null &&
  guest?.introduction?.() === "patron";

export const introduction = () => "patron" as const;

/**
 * Help to turn existed guest intro patron
 * @url https://silentium-lab.github.io/silentium/#/patron
 */
export const patron = <T>(
  willBePatron: GuestType<T>,
): GuestDisposableType<T> => {
  if (willBePatron === undefined) {
    throw new Error("Patron didn't receive willBePatron argument");
  }

  const result = {
    give(value: T) {
      give(value, willBePatron);
      return result;
    },
    disposed(value: T | null): boolean {
      const maybeDisposable = willBePatron as GuestDisposableType;
      return maybeDisposable?.disposed?.(value) || false;
    },
    introduction,
  };

  return result;
};

/**
 * System patron with higher priority than regular patron
 */
export const systemPatron = <T>(
  willBePatron: GuestType<T>,
): GuestDisposableType<T> & PatronWithPriority => {
  const p = patron(willBePatron);

  return {
    ...p,
    priority: () => 200,
  } as GuestDisposableType<T> & PatronWithPriority;
};

/**
 * Set priority on existed patron
 */
export const withPriority = <T extends PatronType<unknown>>(
  patron: T,
  priority: number,
): T & PatronWithPriority => {
  return {
    ...patron,
    priority: () => priority,
  };
};
