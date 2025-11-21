import { Rejections } from "base/Rejections";
import { Late } from "components/Late";
import { MessageType } from "types/MessageType";

/**
 * Message with error catched
 * inside another message
 */
export function Catch<T>($base: MessageType) {
  const rejections = new Rejections();
  $base.catch(rejections.reject);
  const $error = Late<T>();
  rejections.catch((e) => {
    $error.use(e as T);
  });

  return $error;
}
