import { TapType } from "types/TapType";
import { Tap } from "base/Tap";
import { isDestroyed } from "helpers/guards";

/**
 * Helps maintain an owner list allowing different
 * owners to get information from a common source
 * https://silentium-lab.github.io/silentium/#/en/utils/owner-pool
 */
export class TapPool<T> {
  private taps: Set<TapType<T>>;
  private innerTap: TapType<T>;

  public constructor() {
    this.taps = new Set<TapType<T>>();
    this.innerTap = Tap((v) => {
      this.taps.forEach((tap) => {
        if (isDestroyed(tap) && tap.destroyed()) {
          this.taps.delete(tap);
          return;
        }
        tap.use(v);
      });
    });
  }

  public tap() {
    return this.innerTap;
  }

  public size(): number {
    return this.taps.size;
  }

  public has(owner: TapType<T>): boolean {
    return this.taps.has(owner);
  }

  public add(owner: TapType<T>) {
    this.taps.add(owner);
    return this;
  }

  public remove(g: TapType<T>) {
    this.taps.delete(g);
    return this;
  }

  public destroy() {
    this.taps.forEach((g) => {
      this.remove(g);
    });
    return this;
  }
}
