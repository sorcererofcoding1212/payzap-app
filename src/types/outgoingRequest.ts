import { CONNECTION, NOTIFICATION } from "@/lib/constants";

export type OutgoingRequest =
  | {
      type: typeof CONNECTION;
      payload: {
        userId: string;
      };
    }
  | {
      type: typeof NOTIFICATION;
      payload: {
        content: string;
        receiverId: string;
      };
    };
