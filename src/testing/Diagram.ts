import { Tap } from "base/Tap";
import { TapType } from "types/TapType";

/**
 * Helps debug the response flow from information sources
 * in the form of a text diagram
 */
export const Diagram = (joinSymbol = "|") => {
  const responses: unknown[] = [];
  const tap: TapType<string> = Tap((v) => {
    responses.push(v);
  });

  return {
    toString() {
      return responses.join(joinSymbol);
    },
    tap,
  };
};
