import { TheOwner } from "./TheOwner";

/**
 * Silent owner
 */
export class Void extends TheOwner {
  public give(): this {
    return this;
  }
}
