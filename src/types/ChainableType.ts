import { MessageType } from "types/MessageType";

export interface ChainableType<T> {
  chain(m: MessageType<T>): this;
}
