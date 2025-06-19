export type DestructorType = () => void;

export interface DestroyableType {
  destroy: DestructorType;
}
