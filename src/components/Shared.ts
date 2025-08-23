import { isFilled, OwnerPool } from "../helpers";
import { From, OfFunc, TheInformation, TheOwner } from "../base";

/**
 * An information object that helps multiple owners access
 * a single another information object
 * https://silentium-lab.github.io/silentium/#/en/information/pool
 */
export class Shared<T> extends TheInformation<T> {
  private lastValue: T | undefined;
  private ownersPool = new OwnerPool<T>();

  public constructor(
    private baseSrc: TheInformation<T>,
    private stateless = false,
  ) {
    super([baseSrc]);
    this.addDep(this.ownersPool);
    this.baseSrc.value(
      new From((v) => {
        this.ownersPool.owner().give(v);
        this.lastValue = v;
      }),
    );
  }

  public value(o: TheOwner<T>): this {
    const i = new OfFunc((g: TheOwner<T>) => {
      if (
        !this.stateless &&
        isFilled(this.lastValue) &&
        !this.ownersPool.has(g)
      ) {
        g.give(this.lastValue);
      }
      this.ownersPool.add(g);
      return () => {
        this.ownersPool.remove(g);
      };
    });
    i.value(o);
    this.addDep(i);

    return this;
  }

  public pool() {
    return this.ownersPool;
  }
}
