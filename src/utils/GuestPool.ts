import { Guest } from "../Guest";

/**
 * Pool class helps to implement dispatching for guest about new values
 * what may appear in sources
 * @url https://silentium-lab.github.io/silentium/#/utils/guest-pool
 */
export class GuestPool<T> {
  private guests: Set<Guest<T>>;
  private innerGuest: Guest<T>;

  public constructor() {
    this.guests = new Set<Guest<T>>();
    this.innerGuest = new Guest(
      (v) => {
        this.guests.forEach((g) => {
          g.give(v);
        });
      },
      (cause) => {
        this.guests.forEach((g) => {
          g.error(cause);
        });
      },
    );
  }

  public guest() {
    return this.innerGuest;
  }

  public size(): number {
    return this.guests.size;
  }

  public has(guest: Guest<T>): boolean {
    return this.guests.has(guest);
  }

  public add(shouldBePatron: Guest<T>) {
    this.guests.add(shouldBePatron);
    return this;
  }

  public remove(g: Guest<T>) {
    this.guests.delete(g);
    return this;
  }

  public destroy() {
    this.guests.forEach((g) => {
      this.remove(g);
    });
    return this;
  }
}
