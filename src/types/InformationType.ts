import { OwnerType } from "./OwnerType";

/**
 * Main type what destroys information resources
 */
export type DestructorType = () => void;

/**
 * Main type what represents information
 * Information related to one owner, if we
 * need to create shared information then we need
 * to do it explicitly. When owner comes to information
 * it executes information code.
 */
export type InformationType<T = unknown> = (
  owner: OwnerType<T>,
) => DestructorType | void;
