import { DataUserType } from "./DataUserType";

export interface DataUserObjectType<T = unknown> {
  give: DataUserType<T>;
}
