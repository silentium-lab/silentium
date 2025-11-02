import { Transport } from "base/Transport";
import { TransportType } from "types/TransportType";

/**
 * Helps debug the response flow from information sources
 * in the form of a text diagram
 */
export const Diagram = (joinSymbol = "|") => {
  const responses: unknown[] = [];
  const transport: TransportType<string> = Transport((v) => {
    responses.push(v);
  });

  return {
    toString() {
      return responses.join(joinSymbol);
    },
    transport,
  };
};
