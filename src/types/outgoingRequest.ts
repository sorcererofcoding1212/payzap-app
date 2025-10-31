import { CONNECTION, TRANSFER } from "@/lib/constants";

export type OutgoingRequest =
  | {
      type: typeof CONNECTION;
      payload: {
        userId: string;
      };
    }
  | {
      type: typeof TRANSFER;
      payload: {
        amount: number;
        senderName: string;
        recieverId: string;
      };
    };
