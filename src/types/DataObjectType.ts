import { DataType } from "./DataType";

export interface DataObjectType<T = unknown> {
  value: DataType<T>;
}
