import { patron } from "../Patron/Patron";
import { firstVisit, GuestType } from "../Guest/Guest";
import { SourceType, value } from "../Source/Source";
import { sourceOf } from "../Source/SourceChangeable";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Last<T extends any[]> = T extends [...infer U, infer L] ? L : never;

/**
 * Returns value of some source when all sources before it gives their response
 * @url https://silentium-lab.github.io/silentium/#/source/source-chain
 */
export const sourceChain = <T extends SourceType[]>(
  ...sources: T
): SourceType<Last<T>> => {
  const resultSrc = sourceOf<Last<T>>();
  const respondedSources: Record<string, string> = {};

  const respondCount = () => Object.keys(respondedSources).length;

  const visited = firstVisit(() => {
    const lastSrc = sources.at(-1);

    sources.forEach((source, index) => {
      value(
        source,
        patron(() => {
          respondedSources[index] = "1";
          if (respondCount() === sources.length) {
            value(lastSrc, resultSrc);
          }
        }),
      );
    });
  });

  return (g: GuestType<Last<T>>) => {
    visited();
    resultSrc.value(g);
  };
};
