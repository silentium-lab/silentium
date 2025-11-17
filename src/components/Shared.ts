import { MessageType } from "types/MessageType";
import { Late } from "components/Late";
import { Once } from "components/Once";
import { SourceType } from "types/SourceType";
import { TapPool } from "helpers/TapPool";
import { TapType } from "types/TapType";
import { isFilled } from "helpers/guards";
import { Tap } from "base/Tap";

/**
 * An information object that helps multiple owners access
 * a single another information object
 */
export function Shared<T>($base: MessageType<T>, stateless = false) {
  return new SharedImpl<T>($base, stateless);
}

export class SharedImpl<T> implements SourceType<T> {
  private tapPool = new TapPool<T>();
  private lastValue: T | undefined;
  private calls = Late();

  public constructor(
    private $base: MessageType<T>,
    private stateless = false,
  ) {
    Once(this.calls).pipe(
      Tap(() => {
        this.$base.pipe(this.firstCallTap);
      }),
    );
  }

  public pipe(tap: TapType<T>) {
    this.calls.use(1);
    if (!this.stateless && isFilled(this.lastValue) && !this.tapPool.has(tap)) {
      tap.use(this.lastValue);
    }
    this.tapPool.add(tap);
    return this;
  }

  public use(value: T) {
    this.calls.use(1);
    this.lastValue = value;
    this.tapPool.tap().use(value);
    return this;
  }

  private firstCallTap = Tap<T>((v: T) => {
    this.lastValue = v;
    this.tapPool.tap().use(v);
  });

  public touched() {
    this.calls.use(1);
  }

  public pool() {
    return this.tapPool;
  }

  public destroy() {
    return this.tapPool.destroy();
  }
}
