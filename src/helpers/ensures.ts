import { isMessage } from "helpers/guards";

export function ensureFunction(v: unknown, label: string) {
  if (typeof v !== "function") {
    throw new Error(`${label}: is not function`);
  }
}

export function ensureMessage(v: unknown, label: string) {
  if (!isMessage(v)) {
    throw new Error(`${label}: is not message`);
  }
}
