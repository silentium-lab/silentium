import { SourceType } from "../types/SourceType";
import { systemPatron } from "../Guest/Patron";
import { subSourceMany } from "../Guest/PatronPool";
import { value } from "../Source/Source";
import { ExtractTypesFromArray, sourceAll } from "../Source/SourceAll";
import { sourceOf } from "../Source/SourceChangeable";
import { GuestType } from "../types/GuestType";

/**
 * Simplifies sources combination, when we need to create value depending on many sources
 * @url https://silentium-lab.github.io/silentium/#/source/source-combined
 * @deprecated will be removed
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
      systemPatron((actualValues) => {
        source(result.give, ...actualValues);
      }),
    );

    return result.value;
  };
