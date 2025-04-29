import { patron } from "../Patron/Patron";
import { SourceType, value } from "../Source/Source";
import { sourceOf } from "../Source/SourceChangeable";

/**
 * Present source of value what was last appeared in any
 * of given sources, can be used as default value, when some source
 * don't respond
 * @url https://silentium-lab.github.io/silentium/#/source/source-any
 */
export const sourceAny = <T>(sources: SourceType<T>[]) => {
  const lastSrc = sourceOf<T>();
  sources.forEach((source) => {
    value(source, patron(lastSrc));
  });

  return lastSrc;
};
