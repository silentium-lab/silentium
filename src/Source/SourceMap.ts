import { patron } from "../Patron/Patron";
import { patronOnce } from "../Patron/PatronOnce";
import { sourceOf } from "../Source/SourceChangeable";
import { firstVisit, give, GuestType } from "../Guest/Guest";
import { LazyType } from "../Lazy/Lazy";
import { destroy, subSource } from "../Patron/PatronPool";
import { SourceType, value } from "./Source";
import { sourceAll } from "./SourceAll";

/**
 * Helps to modify many sources with one private source
 * @url https://silentium-lab.github.io/silentium/#/source/source-map
 */
export const sourceMap = <T, TG>(
  baseSource: SourceType<T[]>,
  targetSource: LazyType<SourceType<TG>>,
) => {
  if (baseSource === undefined) {
    throw new Error("SourceMap didn't receive baseSource argument");
  }
  if (targetSource === undefined) {
    throw new Error("SourceMap didn't receive targetSource argument");
  }

  const result = sourceOf<TG[]>();

  const visited = firstVisit(() => {
    value(
      baseSource,
      patron((theValue) => {
        const sources: SourceType[] = [];
        theValue.forEach((val) => {
          const source = targetSource.get(val);
          subSource(source, baseSource);
          sources.push(source);
        });
        value(
          sourceAll(sources),
          patronOnce((v) => {
            destroy(...sources);
            give(v, result);
          }),
        );
      }),
    );
  });

  return (g: GuestType<TG[]>) => {
    visited();
    result.value(g);
  };
};
