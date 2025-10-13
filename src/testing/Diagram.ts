import { EventUserType } from "../types";

/**
 * Помогает отлаживать поток ответов от источников информации
 * в виде текстовой диаграммы
 */
export const Diagram = (joinSymbol = "|") => {
  const responses: unknown[] = [];
  const user: EventUserType<string> = (v) => {
    responses.push(v);
  };

  return {
    toString() {
      return responses.join(joinSymbol);
    },
    user,
  };
};
