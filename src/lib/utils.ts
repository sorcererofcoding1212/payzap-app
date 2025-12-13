import { clsx, type ClassValue } from "clsx";
import { signOut } from "next-auth/react";
import { twMerge } from "tailwind-merge";

export const ONRAMP = "ONRAMP";
export const OFFRAMP = "OFFRAMP";
export const P2P = "P2P";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const onLogout = () => {
  signOut({
    redirect: true,
  });
};

export const generateTransactionId = (length: number) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const generateWalletId = (email: string) => {
  const walletId = `${email.split("@")[0]}@payzap`;
  return walletId;
};

export const adjustAmount = (
  amount: number,
  side: "DATABASE" | "APPLICATION"
) => {
  if (side === "DATABASE") {
    return amount * 100;
  } else {
    return amount / 100;
  }
};

export const checkValidWalletId = (walletId: string) => {
  if (!walletId.includes("@")) return false;

  const splitWalletId = walletId.split("@");
  if (splitWalletId[1] !== "payzap") return false;

  return true;
};

export const getTransactionDate = (txnDate: Date) => {
  return `${txnDate.getDate()}-${txnDate.getMonth()}-${txnDate.getFullYear()}`;
};

export const getTransactionTime = (txnDate: Date) => {
  return `${txnDate.getHours()}:${
    txnDate.getMinutes().toString().length === 1
      ? `0${txnDate.getMinutes()}`
      : `${txnDate.getMinutes()}`
  }`;
};

export const truncateText = (str: string, max: number) => {
  return str.length > max ? str.slice(0, max) + "…" : str;
};

export const readTime = (date: Date): string => {
  const now = new Date();

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(date, yesterday)) return "Yesterday";

  if (isSameDay(date, now)) {
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  return date.toLocaleDateString("en-US", { weekday: "short" });
};
