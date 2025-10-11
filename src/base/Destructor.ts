import { DestructorType, EventType, EventUserType } from "../types";

export const destructor = <T>(
  baseEv: EventType<T>,
  destructorUser?: EventUserType<DestructorType>,
) => {
  let mbDestructor: DestructorType | void;
  let theUser: EventUserType<T> | null = null;
  const destroy = () => {
    theUser = null;
    mbDestructor?.();
  };
  return {
    event: function DestructorData(u: any) {
      theUser = u;
      mbDestructor = baseEv((v) => {
        if (theUser) {
          theUser(v);
        }
      });
      if (mbDestructor && destructorUser) {
        destructorUser(destroy);
      }
      return destroy;
    } as EventType<T>,
    destroy,
  };
};
