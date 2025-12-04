import { DestroyContainer } from "base/DestroyContainer";
import { Message } from "base/Message";
import { Late } from "components/Late";
import { ConstructorType } from "types/ConstructorType";
import { MessageType } from "types/MessageType";

export function Process<T, R = unknown>(
  $base: MessageType<T>,
  builder: ConstructorType<[T], MessageType<R>>,
) {
  return Message<R>((resolve, reject) => {
    const $res = Late<R>();
    const dc = DestroyContainer();

    $base.then((v) => {
      dc.destroy();
      const $msg = builder(v);
      dc.add($msg);
      $res.chain($msg);
      $msg.catch(reject);
    });
    $base.catch(reject);
    $res.then(resolve);

    return () => {
      dc.destroy();
    };
  });
}
