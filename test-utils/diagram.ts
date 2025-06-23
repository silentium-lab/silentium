import { G } from "../src/Guest/Guest";

/**
 * Помогает отлаживать поток ответов от источников информации
 * в виде текстовой диаграммы
 */
export const diagram = (joinSymbol = "|") => {
  const responses: any[] = [];

  return [
    () => responses.join(joinSymbol),
    G((v) => {
      responses.push(v);
    }),
  ] as const;
};
