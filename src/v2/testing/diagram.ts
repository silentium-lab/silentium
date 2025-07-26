/**
 * Помогает отлаживать поток ответов от источников информации
 * в виде текстовой диаграммы
 */
export const diagram = (joinSymbol = "|") => {
  const responses: any[] = [];

  return [
    () => responses.join(joinSymbol),
    (v: any) => {
      responses.push(v);
    },
  ] as const;
};
