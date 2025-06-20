import { subSource, subSourceMany } from "../Guest/PatronPool";
import { firstVisit } from "../Guest/Guest";
import { systemPatron } from "../Guest/Patron";
import { value } from "../Source/Source";
import { sourceOf } from "../Source/SourceChangeable";
import { SourceType } from "../types/SourceType";
import { GuestType } from "../types/GuestType";

/**
 * Present source of value what was last appeared in any
 * of given sources, can be used as default value, when some source
 * don't respond
 * @url https://silentium-lab.github.io/silentium/#/source/source-any
 */
export const sourceAny = <T>(sources: SourceType<T>[]) => {
  const lastSrc = sourceOf<T>();

  const visited = firstVisit(() => {
    sources.forEach((source) => {
      value(source, systemPatron(lastSrc));
      subSource(lastSrc, source);
    });
  });

  const src = (g: GuestType<T>) => {
    visited();
    lastSrc.value(g);
  };
  subSourceMany(src, sources);

  return src;
};
