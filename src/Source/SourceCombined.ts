import { GuestType } from "../Guest/Guest";
import { patron } from "../Patron/Patron";
import { subSourceMany } from "../Patron/PatronPool";
import { SourceType, value } from "../Source/Source";
import { ExtractTypesFromArray, sourceAll } from "../Source/SourceAll";
import { sourceOf } from "../Source/SourceChangeable";

/**
 * Simplifies sources combination, when we need to create value depending on many sources
 * @url https://silentium-lab.github.io/silentium/#/source/source-combined
 */
export const sourceCombined =
  <const T extends SourceType[]>(...sources: T) =>
  <R>(
    source: (
      guest: GuestType<R>,
      ...sourcesValues: ExtractTypesFromArray<T>
    ) => void,
  ): SourceType<R> => {
    const result = sourceOf<R>();
    subSourceMany(result, sources);

    value(
      sourceAll(sources),
      patron((actualValues) => {
        source(result.give, ...actualValues);
      }),
    );

    return result.value;
  };
