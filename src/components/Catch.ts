import { Rejections } from "base/Rejections";
import { Late } from "components/Late";
import { MessageType } from "types/MessageType";

/**
 * Message with error caught
 * inside another message
 *
 * @url https://silentium.pw/article/catch/view
 */
export function Catch<T>($base: MessageType) {
  const rejections = Rejections();
  $base.catch(rejections.reject);
  const $error = Late<T>();
  rejections.catch((e) => {
    $error.use(e as T);
  });
  return $error;
}
