"use client";

import { SOCKET_URL } from "@/config/config";
import { CONNECTION, NOTIFICATION } from "@/lib/constants";
import { useSocketStore } from "@/store/socketStore";
import { IncomingRequest } from "@/types/incomingRequest";
import { OutgoingRequest } from "@/types/outgoingRequest";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import { toast } from "sonner";

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const setSocket = useSocketStore((state) => state.setSocket);
  const { status, data } = useSession();

  useEffect(() => {
    if (status !== "authenticated" || !data?.user?.id) return;

    const socket = new WebSocket(SOCKET_URL);

    const outgoingMessage: OutgoingRequest = {
      type: CONNECTION,
      payload: {
        userId: data.user.id,
      },
    };

    socket.addEventListener("open", () => {
      socket.send(JSON.stringify(outgoingMessage));
    });

    socket.addEventListener("message", (event: MessageEvent<string>) => {
      const parsedMessage = JSON.parse(event.data) as IncomingRequest;

      if (parsedMessage.type === NOTIFICATION) {
        toast.success(parsedMessage.payload.msg);
      }
    });

    socket.addEventListener("close", () => {
      console.log("Socket disconnected");
    });

    setSocket(socket);

    return () => {
      socket.close();
      setSocket(null);
    };
  }, [setSocket, status, data?.user.id]);

  return <>{children}</>;
};
