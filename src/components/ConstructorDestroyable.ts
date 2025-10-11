import { DestroyableType, DestructorType, ConstructorType } from "../types";

/**
 * Constructor what can be destroyed
 */
export const constructorDestroyable = (
  baseConstructor: ConstructorType<any[], DestroyableType>,
): {
  get: ConstructorType<any[], DestroyableType>;
  destroy: DestructorType;
} => {
  const instances: DestroyableType[] = [];
  return {
    get: function ConstructorDestroyable(...args) {
      const inst = baseConstructor(...args);
      instances.push(inst);
      return inst;
    },
    destroy: function ConstructorDestructor() {
      instances.forEach((i) => i.destroy());
    },
  };
};
