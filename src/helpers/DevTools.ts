import { All } from "components/All";
import { Applied } from "components/Applied";
import { Primitive } from "components/Primitive";
import { Shared } from "components/Shared";
import { MessageType } from "types/MessageType";

declare global {
  interface GlobalThis {
    silentiumPrint: (...messages: MessageType[]) => MessageType;
    silentiumValue: ($message: MessageType) => unknown;
  }
}

const silentiumPrint = (...messages: MessageType[]) => {
  Applied(All(...messages.map((e) => Shared(e))), (r) => ({
    name,
    ...r,
  })).then(console.table);
};
const silentiumValue = ($message: MessageType) =>
  Primitive($message).primitive();

/**
 * global functions for debuging
 * silentium programs
 */
export function DevTools() {
  if (typeof globalThis !== "undefined") {
    (globalThis as any).silentiumValue = silentiumValue;
    (globalThis as any).silentiumPrint = silentiumPrint;
  }
}
