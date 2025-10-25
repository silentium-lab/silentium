import { EventUserType } from "../types";

/**
 * Silent user
 */
export class Void implements EventUserType {
  public use(): this {
    return this;
  }
}
