import { MessageType } from "types/MessageType";

export interface EmptyType {
  empty(): MessageType<boolean>;
}
