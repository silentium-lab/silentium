import { destructor } from "../base/Destructor";
import { DestructorType, EventType } from "../types";

export const destroyContainer = () => {
  const destructors: DestructorType[] = [];
  return {
    add(e: EventType) {
      const d = destructor(e);
      destructors.push(d.destroy);
      return d.event;
    },
    destroy() {
      destructors.forEach((d) => d());
    },
  };
};
