import { EventUserType } from "./EventUserType";

export interface EventUserObjectType<T = unknown> {
  use: EventUserType<T>;
}
