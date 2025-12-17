import { All } from "components/All";
import { Applied } from "components/Applied";
import { Primitive } from "components/Primitive";
import { Shared } from "components/Shared";
import { ConstructorType } from "types/ConstructorType";
import { DestroyableType } from "types/DestroyableType";
import { MessageType } from "types/MessageType";

declare global {
  interface SilentiumDebug {
    value: ($message: MessageType) => unknown;
    print: (...messages: MessageType[]) => void;
    destroyable: (onDestroy: () => void) => MessageType<any> & DestroyableType;
  }

  interface GlobalThis {
    silentiumDebug: SilentiumDebug;
  }

  // @ts-expect-error global variable
  const silentiumDebug: SilentiumDebug;
}

/**
 * Helps to print message value
 */
const silentiumPrint = (...messages: MessageType[]) => {
  Applied(All(...messages.map((e) => Shared(e))), JSON.stringify).then(
    console.log,
  );
};

/**
 * Helps to debug current value of message
 */
const silentiumValue = ($message: MessageType) =>
  Primitive($message).primitive();

export class MessageDestroyable implements MessageType<any>, DestroyableType {
  public constructor(private onDestroy: () => void) {}

  public then(resolve: ConstructorType<[string]>) {
    resolve(`Wait destroy ${Date.now()}`);
    return this;
  }

  public catch() {
    return this;
  }

  public destroy() {
    this.onDestroy();
    return this;
  }
}

/**
 * Helps to debug destroying
 */
const silentiumDestroyable = (onDestroy: () => void) =>
  new MessageDestroyable(onDestroy);

/**
 * global functions for debuging
 * silentium programs
 */
export function DevTools() {
  if (typeof globalThis !== "undefined") {
    (globalThis as any).silentiumDebug = {
      value: silentiumValue,
      print: silentiumPrint,
      destroyable: silentiumDestroyable,
    };
  }
}
