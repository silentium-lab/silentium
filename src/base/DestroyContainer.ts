import { DestroyableType } from "../types";

export class DestroyContainer implements DestroyableType {
  private destructors: DestroyableType[] = [];

  public add(e: DestroyableType) {
    this.destructors.push(e);
    return this;
  }

  public destroy() {
    this.destructors.forEach((d) => d.destroy());
    return this;
  }
}
