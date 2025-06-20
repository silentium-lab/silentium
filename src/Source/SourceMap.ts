import { SourceType } from "../types/SourceType";
import { firstVisit, give } from "../Guest/Guest";
import { systemPatron } from "../Guest/Patron";
import { patronOnce } from "../Guest/PatronOnce";
import { destroy, subSource } from "../Guest/PatronPool";
import { sourceOf } from "../Source/SourceChangeable";
import { value } from "./Source";
import { sourceAll } from "./SourceAll";
import { LazyType } from "../types/LazyType";
import { GuestType } from "../types/GuestType";

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
      systemPatron((theValue) => {
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

  const src = (g: GuestType<TG[]>) => {
    visited();
    result.value(g);
  };
  subSource(result, src);

  return src;
};
