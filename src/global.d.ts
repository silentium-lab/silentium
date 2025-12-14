import { MessageType } from "types/MessageType";

export {};

declare global {
  interface GlobalThis {
    silentiumValue: ($message: MessageType) => unknown;
    silentiumPrint: (...messages: MessageType[]) => void;
  }

  function silentiumValue($message: MessageType): unknown;
  function silentiumPrint(...messages: MessageType[]): void;
}
