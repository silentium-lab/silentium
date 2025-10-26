import { EventUserType } from "../types";

export function Void() {
  return new TheVoid();
}

/**
 * Silent user
 */
export class TheVoid implements EventUserType {
  public use(): this {
    return this;
  }
}
