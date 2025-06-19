import { GuestType } from "src/Guest/Guest";
import { subSource } from "../Patron/PatronPool";
import { SourceExecutorType, SourceObjectType } from "./Source";
import { DestroyableType, DestructorType } from "src/types";

/**
 * Ability to create sources that support special destruction logic
 * @url https://silentium-lab.github.io/silentium/#/source/source-destroyable
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
