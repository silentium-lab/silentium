import { MaybeMessage, MessageType } from "types/MessageType";
import { TapParent } from "base/Tap";
import { TapType } from "types/TapType";
import { ensureMessage } from "helpers/ensures";
import { ActualMessage } from "base/ActualMessage";

type ExtractTypeS<T> = T extends MaybeMessage<infer U> ? U : never;

type ExtractTypesFromArrayS<T extends MaybeMessage<any>[]> = {
  [K in keyof T]: ExtractTypeS<T[K]>;
};

const isAllFilled = (keysFilled: Set<string>, keysKnown: Set<string>) => {
  return keysFilled.size > 0 && keysFilled.size === keysKnown.size;
};

/**
 * A message that represents values from
 * all provided messages as an array.
 * When all messages emit their values,
 * the combined value will be returned.
 * If at least one message later emits a new
 * value, the updated array with the new value
 * will be emitted by All.
 */
export function All<const T extends MaybeMessage[]>(...messages: T) {
  return new AllImpl<T>(...messages);
}

export class AllImpl<const T extends MaybeMessage[]>
  implements MessageType<ExtractTypesFromArrayS<T>>
{
  private known: Set<string>;
  private filled = new Set<string>();
  private $messages: MessageType[];
  private result: unknown[] = [];

  public constructor(...messages: T) {
    this.known = new Set<string>(Object.keys(messages));
    this.$messages = messages.map(ActualMessage);
  }

  public pipe(tap: TapType<ExtractTypesFromArrayS<T>>): this {
    Object.entries(this.$messages).forEach(([key, message]) => {
      ensureMessage(message, "All: item");
      message.pipe(this.tap.child(tap, key));
    });
    if (this.known.size === 0) {
      tap.use([] as ExtractTypesFromArrayS<T>);
    }
    return this;
  }

  private tap = TapParent(function (
    v: unknown,
    child: AllImpl<T>,
    key: string,
  ) {
    child.filled.add(key);
    child.result[parseInt(key)] = v;
    if (isAllFilled(child.filled, child.known)) {
      this.use(child.result as ExtractTypesFromArrayS<T>);
    }
  }, this);
}
