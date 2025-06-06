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
  const respondedSources = new WeakMap();

  const repeatValue = () => {
    value(resultSrc, resultSrc);
  };

  const handleSource = (index: number) => {
    const source = sources[index];
    const nextSource = sources[index + 1];

    value(
      source,
      patron((v) => {
        if (nextSource) {
          repeatValue();
        }

        if (!nextSource) {
          resultSrc.give(v as Last<T>);
        } else if (!respondedSources.has(source)) {
          handleSource(index + 1);
        }

        respondedSources.set(source, 1);
      }),
    );
  };

  const visited = firstVisit(() => {
    handleSource(0);
  });

  return (g: GuestType<Last<T>>) => {
    visited();
    resultSrc.value(g);
  };
};
