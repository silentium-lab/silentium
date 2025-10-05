import { DataType, DataUserType, DestructorType } from "src/types";

export const destructor =
  <T>(
    src: DataType<T>,
    destructorUser?: DataUserType<DestructorType>,
  ): DataType<T> =>
  (u) => {
    const mbDestructor = src(u);
    if (mbDestructor && destructorUser) {
      destructorUser(mbDestructor);
    }
    return () => {
      mbDestructor?.();
    };
  };
