import { NOTIFICATION } from "../lib/constants";

export type IncomingRequest = {
  type: typeof NOTIFICATION;
  payload: {
    msg: string;
  };
};