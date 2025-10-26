import { isEvent, isUser } from "../helpers/guards";

export function ensureFunction(v: unknown, label: string) {
  if (typeof v !== "function") {
    throw new Error(`${label}: is not function`);
  }
}

export function ensureEvent(v: unknown, label: string) {
  if (!isEvent(v)) {
    throw new Error(`${label}: is not event`);
  }
}

export function ensureUser(v: unknown, label: string) {
  if (!isUser(v)) {
    throw new Error(`${label}: is not user`);
  }
}
