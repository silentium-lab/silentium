import { patron } from "../Patron/Patron";
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
  const respondedSources = new Set();
  let lastSourceValue: any = null;
  sources.forEach((source, index) => {
    value(
      source,
      patron((value) => {
        respondedSources.add(index);
        if (index === sources.length - 1) {
          lastSourceValue = value;
        }
        if (
          respondedSources.size === sources.length &&
          lastSourceValue !== null
        ) {
          resultSrc.give(lastSourceValue);
        }
      }),
    );
  });

  return resultSrc.value;
};
