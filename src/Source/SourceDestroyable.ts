import { SourceExecutorType, SourceObjectType } from "./Source";

export type DestructorType = () => void;

export interface DestroyableType {
  destroy: DestructorType;
}

/**
 * Ability to create sources that support special destruction logic
 * @url https://silentium-lab.github.io/silentium/#/source/source-destroyable
 */
export const sourceDestroyable = <T>(
  source: SourceExecutorType<T, DestructorType>,
): SourceObjectType<T> & DestroyableType => {
  let destructor: DestructorType | null = null;
  return {
    value(g) {
      destructor = source(g);
      return this;
    },
    destroy() {
      if (destructor !== null && typeof destructor === "function") {
        destructor();
      }
      return this;
    },
  };
};
