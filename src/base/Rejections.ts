import { ConstructorType } from "types/ConstructorType";

/**
 * Handles rejections collection
 */
export class Rejections {
  private catchers: ConstructorType<[unknown]>[] = [];

  public reject = (reason: unknown) => {
    this.catchers.forEach((catcher) => {
      catcher(reason);
    });
  };

  public catch(rejected: ConstructorType<[unknown]>) {
    this.catchers.push(rejected);
    return this;
  }

  public destroy() {
    this.catchers.length = 0;
    return this;
  }
}
