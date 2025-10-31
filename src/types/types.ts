import { OFFRAMP, ONRAMP, P2P } from "@/lib/utils";
import { $Enums } from "@manvirsingh7/payzap-database/generated/prisma/client";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      emailVerified: boolean;
    };
  }

  interface User {
    id: string;
    emailVerified: boolean;
  }
}

export type Transaction =
  | {
      type: typeof ONRAMP;
      id: string;
      status: $Enums.TransactionStatus;
      provider: string;
      amount: number;
      startTime: Date;
    }
  | {
      type: typeof OFFRAMP;
      id: string;
      status: $Enums.TransactionStatus;
      provider: string;
      amount: number;
      startTime: Date;
    }
  | {
      type: typeof P2P;
      id: string;
      status: $Enums.TransactionStatus;
      amount: number;
      startTime: Date;
      p2pTransactionType: "CREDIT" | "DEBIT";
      counterPartyName?: string;
      counterPartyId?: string;
      counterPartyAccountId?: string;
    };
