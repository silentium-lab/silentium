import { DataUserType } from "./DataUserType";

export type DestructorType = () => void;
export type DataType<T = unknown> = (
  user: DataUserType<T>,
) => DestructorType | void;

export interface DestroyableType {
  destroy: DestructorType;
}

export type DataTypeValue<T> = T extends DataType<infer U> ? U : never;
