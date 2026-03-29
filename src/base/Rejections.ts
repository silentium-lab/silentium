import { ConstructorType } from "types/ConstructorType";

/**
 * Handles rejections collection
 */
export function Rejections() {
  return new RejectionsImpl();
}

/**
 * Implementation of rejections collection
 */
export class RejectionsImpl {
  private catchers: ConstructorType<[unknown]>[] = [];
  private lastRejectReason: unknown = null;

  public static globalCatch?: ConstructorType<[unknown]>;

  public reject = (reason: unknown) => {
    this.lastRejectReason = reason;
    this.catchers.forEach((catcher) => {
      catcher(reason);
    });
    if (RejectionsImpl.globalCatch) {
      RejectionsImpl.globalCatch(reason);
    } else if (this.catchers.length === 0) {
      console.error(["Unhandled Message Rejection:", reason].join(" "));
    }
  };

  public catch(rejected: ConstructorType<[unknown]>) {
    if (this.lastRejectReason !== null) {
      rejected(this.lastRejectReason);
    }
    this.catchers.push(rejected);
    return this;
  }

  public destroy() {
    this.catchers.length = 0;
    return this;
  }
}
