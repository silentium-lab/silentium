import { destructor } from "../base";
import {
  DestroyableType,
  DestructorType,
  ConstructorType,
  EventType,
  EventObjectType,
} from "../types";

/**
 * Constructor what can be destroyed
 */
export const constructorDestroyable = (
  baseConstructor: ConstructorType<
    any[],
    (DestroyableType & EventObjectType) | EventType
  >,
): {
  get: ConstructorType<any[], DestroyableType & EventObjectType>;
  destroy: DestructorType;
} => {
  const destructors: DestructorType[] = [];
  return {
    get: function ConstructorDestroyable(...args) {
      const inst = baseConstructor(...args);
      if ("destroy" in inst) {
        destructors.push(inst.destroy);
      } else {
        const d = destructor(inst);
        destructors.push(d.destroy);
        return d;
      }
      return inst;
    },
    destroy: function ConstructorDestructor() {
      destructors.forEach((i) => i());
    },
  };
};
