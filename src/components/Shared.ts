import { User } from "../base";
import { Late } from "../components/Late";
import { Once } from "../components/Once";
import { isFilled, OwnerPool } from "../helpers";
import { EventType, EventUserType, SourceType } from "../types";

/**
 * An information object that helps multiple owners access
 * a single another information object
 * https://silentium-lab.github.io/silentium/#/en/information/pool
 */
export class Shared<T> implements SourceType<T> {
  private ownersPool = new OwnerPool<T>();
  private lastValue: T | undefined;
  private calls = new Late();
  private firstCall = new Once(this.calls).event(
    new User(() => {
      this.$base.event(this.firstCallUser);
    }),
  );

  public constructor(
    private $base: EventType<T>,
    private stateless = false,
  ) {}

  public event(user: EventUserType<T>) {
    this.calls.use(1);
    if (
      !this.stateless &&
      isFilled(this.lastValue) &&
      !this.ownersPool.has(user)
    ) {
      user.use(this.lastValue);
    }
    this.ownersPool.add(user);
    return this;
  }

  public use(value: T) {
    this.calls.use(1);
    this.lastValue = value;
    this.ownersPool.owner().use(value);
    return this;
  }

  private firstCallUser = new User<T>((v: T) => {
    this.lastValue = v;
    this.ownersPool.owner().use(v);
  });

  public touched() {
    this.calls.use(1);
  }

  public pool() {
    return this.ownersPool;
  }

  public destroy() {
    return this.ownersPool.destroy();
  }
}
