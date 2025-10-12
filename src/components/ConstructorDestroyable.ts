import {
  ConstructorType,
  DestroyableType,
  DestructorType,
  EventObjectType,
  EventType,
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
  get: ConstructorType<any[], EventType>;
  destroy: DestructorType;
} => {
  const destructors: DestructorType[] = [];
  return {
    get: function ConstructorDestroyable(...args) {
      const inst = baseConstructor(...args);
      return (user) => {
        if ("destroy" in inst) {
          destructors.push(inst.destroy);
          inst.event(user);
        } else {
          const d = inst(user);
          if (d) {
            destructors.push(d);
          }
        }

        return () => {
          destructors.forEach((i) => i());
        };
      };
    },
    destroy: function ConstructorDestructor() {
      destructors.forEach((i) => i());
    },
  };
};
