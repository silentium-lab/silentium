import { Source } from "../Source/Source";
import { SourceDataType } from "../types/SourceType";

export const of = <T>(source?: SourceDataType<T>) => new Source(source, "of");
