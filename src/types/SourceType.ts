import { DataObjectType } from "./DataObjectType";
import { DataUserObjectType } from "./DataUserObjectType";

export type SourceType<T = unknown> = DataObjectType<T> & DataUserObjectType<T>;
