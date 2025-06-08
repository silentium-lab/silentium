import { firstVisit, give, GuestType } from "../Guest/Guest";
import { systemPatron } from "../Patron/Patron";
import { subSource } from "../Patron/PatronPool";
import { SourceType, value } from "../Source/Source";
import { sourceOf } from "../Source/SourceChangeable";
import { sourceDynamic } from "../Source/SourceDynamic";

/**
 * @url https://silentium-lab.github.io/silentium/#/source/source-resettable
 */
export const sourceResettable = <T>(
  baseSrc: SourceType<T>,
  resettableSrc: SourceType<unknown>,
) => {
  const result = sourceOf<T>();

  const visited = firstVisit(() => {
    value(
      resettableSrc,
      systemPatron(() => {
        give(null, result);
      }),
    );

    value(baseSrc, systemPatron(result));
    subSource(result, baseSrc);
  });

  return sourceDynamic(result.give, (g: GuestType<T>) => {
    visited();
    result.value(g);
  });
};
