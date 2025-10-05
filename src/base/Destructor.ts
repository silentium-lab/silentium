import { DataType, DataUserType, DestructorType } from "src/types";

export const destructor = <T>(
  src: DataType<T>,
  destructorUser?: DataUserType<DestructorType>,
) => {
  let mbDestructor: DestructorType | void;
  return {
    value: ((u) => {
      mbDestructor = src(u);
      if (mbDestructor && destructorUser) {
        destructorUser(mbDestructor);
      }
      return () => {
        mbDestructor?.();
      };
    }) as DataType<T>,
    destroy: () => {
      mbDestructor?.();
    },
  };
};
