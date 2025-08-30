import { InformationType } from "../base/TheInformation";
import { OwnerType } from "../base/TheOwner";

export type SourceType<T> = InformationType<T> & OwnerType<T>;
