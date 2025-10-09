import { DataType, DataUserType, DestructorType } from "../types";

export const destructor = <T>(
  src: DataType<T>,
  destructorUser?: DataUserType<DestructorType>,
) => {
  let mbDestructor: DestructorType | void;
  let theUser: DataUserType<T> | null = null;
  const destroy = () => {
    theUser = null;
    mbDestructor?.();
  };
  return {
    value: function DestructorData(u: any) {
      theUser = u;
      mbDestructor = src((v) => {
        if (theUser) {
          theUser(v);
        }
      });
      if (mbDestructor && destructorUser) {
        destructorUser(destroy);
      }
      return destroy;
    } as DataType<T>,
    destroy,
  };
};
