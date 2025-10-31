import { create } from "zustand";

interface SocketStoreProps {
  socket: WebSocket | null;
  setSocket: (socket: WebSocket | null) => void;
}

export const useSocketStore = create<SocketStoreProps>((set) => ({
  socket: null,
  setSocket: (socket) => {
    set({ socket });
  },
}));
