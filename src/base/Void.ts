import { EventUserType } from "../types";

/**
 * Silent user
 */
export function Void(): EventUserType {
  return function VoidEvent() {};
}
