import { Destructor } from "../base/Destructor";
import { DestructorType, EventType } from "../types";

export function DestroyContainer() {
  const destructors: DestructorType[] = [];
  return {
    add(e: EventType) {
      const d = Destructor(e);
      destructors.push(d.destroy);
      return d.event;
    },
    destroy() {
      destructors.forEach((d) => d());
    },
  };
}
