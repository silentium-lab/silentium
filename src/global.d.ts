import { MessageType } from "types/MessageType";

export {};

declare global {
  interface GlobalThis {
    silentiumDebug: {
      value: ($message: MessageType) => unknown;
      print: (...messages: MessageType[]) => void;
      destroyable: (
        onDestroy: () => void,
      ) => MessageType<any> & DestroyableType;
    };
  }

  declare const silentiumDebug: {
    value: ($message: MessageType) => unknown;
    print: (...messages: MessageType[]) => void;
    destroyable: (onDestroy: () => void) => MessageType<any> & DestroyableType;
  };
}
