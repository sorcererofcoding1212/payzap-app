import { create } from "zustand";

interface AccountStoreProps {
  pinVerified: boolean;
  setPinVerified: (value: boolean) => void;
}

export const useAccountStore = create<AccountStoreProps>((set) => ({
  pinVerified: false,
  setPinVerified: (value) => {
    set({ pinVerified: value });
  },
}));
