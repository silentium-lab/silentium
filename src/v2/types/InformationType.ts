import { OwnerType } from "./OwnerType";

/**
 * Main type what destroys information resources
 */
export type DesctructionType = () => void;

/**
 * Main type what represents information
 */
export type InformationType<T = unknown> = (
  owner: OwnerType<T>,
) => DesctructionType | void;
