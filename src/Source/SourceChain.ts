import { subSourceMany } from "../Guest/PatronPool";
import { firstVisit } from "../Guest/Guest";
import { systemPatron } from "../Guest/Patron";
import { sourceOf } from "../Source/SourceChangeable";
import { SourceType } from "../types/SourceType";
import { value } from "../Source/Source";
import { GuestType } from "../types/GuestType";

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
      systemPatron((v) => {
        let sourceKey = source;

        if (
          (typeof source !== "object" || source === null) &&
          typeof source !== "function" &&
          !Array.isArray(source)
        ) {
          sourceKey = { source };
        }

        if (nextSource) {
          repeatValue();
        }

        if (!nextSource) {
          resultSrc.give(v as Last<T>);
        } else if (!respondedSources.has(sourceKey)) {
          handleSource(index + 1);
        }

        respondedSources.set(sourceKey, 1);
      }),
    );
  };

  const visited = firstVisit(() => {
    handleSource(0);
  });

  const src = (g: GuestType<Last<T>>) => {
    visited();
    resultSrc.value(g);
  };
  subSourceMany(src, sources);
  subSourceMany(resultSrc, sources);

  return src;
};
