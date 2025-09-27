import { DataUserType } from "../types";

/**
 * Помогает отлаживать поток ответов от источников информации
 * в виде текстовой диаграммы
 */
export const diagram = (joinSymbol = "|") => {
  const responses: any[] = [];
  const user: DataUserType<string> = (v) => {
    responses.push(v);
  };

  return {
    toString() {
      return responses.join(joinSymbol);
    },
    user,
  };
};
