import { give, GuestType } from "../Guest/Guest";
import { GuestDisposableType } from "../Guest/GuestDisposable";

/**
 * Helps to check what incoming object is patron
 * @url https://silentium-lab.github.io/silentium/#/utils/is-patron
 */
export const isPatron = (guest: GuestType): guest is Patron<unknown> =>
  typeof guest === "object" &&
  guest !== null &&
  guest?.introduction?.() === "patron";

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
    introduction() {
      return "patron" as const;
    },
  };

  return result;
};

export class Patron<T> implements GuestDisposableType<T> {
  public constructor(private willBePatron: GuestType<T>) {
    if (willBePatron === undefined) {
      throw new Error("Patron didnt receive willBePatron argument");
    }
  }

  public introduction() {
    return "patron" as const;
  }

  public give(value: T): this {
    give(value, this.willBePatron);
    return this;
  }

  public disposed(value: T | null): boolean {
    const maybeDisposable = this.willBePatron as GuestDisposableType;
    return maybeDisposable?.disposed?.(value) || false;
  }
}
