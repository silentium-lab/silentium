import { EventUserType } from "../types";

/**
 * Silent user
 */
export const _void = (): EventUserType => function VoidEvent() {};
