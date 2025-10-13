import { DestructorType, EventType, EventUserType } from "../types";

export function Destructor<T>(
  baseEv: EventType<T>,
  destructorUser?: EventUserType<DestructorType>,
) {
  let mbDestructor: DestructorType | void;
  let theUser: WeakRef<EventUserType<T>> | null = null;
  const destroy = () => {
    theUser = null;
    mbDestructor?.();
  };
  return {
    event: function DestructorEvent(user) {
      theUser = new WeakRef(user);
      mbDestructor = baseEv((v) => {
        if (theUser) {
          theUser.deref()?.(v);
        }
      });
      if (mbDestructor && destructorUser) {
        destructorUser(destroy);
      }
      return destroy;
    } as EventType<T>,
    destroy,
  };
}
