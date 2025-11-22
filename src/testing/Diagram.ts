/**
 * Helps debug the response flow from information sources
 * in the form of a text diagram
 */
export const Diagram = (joinSymbol = "|") => {
  const responses: unknown[] = [];
  const resolver = (v: any) => {
    responses.push(v);
  };

  return {
    toString() {
      return responses.join(joinSymbol);
    },
    resolver,
  };
};
