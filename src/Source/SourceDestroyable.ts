import { subSource } from "../Guest/PatronPool";
import { DestroyableType, DestructorType } from "../types";
import { GuestType } from "../types/GuestType";
import { SourceExecutorType, SourceObjectType } from "../types/SourceType";

/**
 * Ability to create sources that support special destruction logic
 * @url https://silentium-lab.github.io/silentium/#/source/source-destroyable
 * @deprecated will be removed
 */
export const sourceDestroyable = <T>(
  source: SourceExecutorType<T, DestructorType>,
): SourceObjectType<T> & DestroyableType => {
  let destructor: DestructorType | null = null;
  const result = {
    value(g: GuestType<T>) {
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
  subSource(result, source);

  return result;
};
