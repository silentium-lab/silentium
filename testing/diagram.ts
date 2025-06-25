import { O } from "../src/Owner/Owner";

/**
 * Помогает отлаживать поток ответов от источников информации
 * в виде текстовой диаграммы
 */
export const diagram = (joinSymbol = "|") => {
  const responses: any[] = [];

  return [
    () => responses.join(joinSymbol),
    O((v) => {
      responses.push(v);
    }),
  ] as const;
};
