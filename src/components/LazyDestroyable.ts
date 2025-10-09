import { DestroyableType, DestructorType, ValueType } from "../types";

/**
 * Lazy what can be destroyed
 */
export const lazyDestroyable = (
  baseLazy: ValueType<any[], DestroyableType>,
): { get: ValueType<any[], DestroyableType>; destroy: DestructorType } => {
  const instances: DestroyableType[] = [];
  return {
    get: function lazyDestroyable(...args) {
      const inst = baseLazy(...args);
      instances.push(inst);
      return inst;
    },
    destroy: function LazyDestructor() {
      instances.forEach((i) => i.destroy());
    },
  };
};
