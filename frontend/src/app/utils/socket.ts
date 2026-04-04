import { io, Socket } from "socket.io-client";

const resolveSocketUrl = () => {
  const envUrl = import.meta.env.VITE_SOCKET_URL?.replace(/\/$/, "");
  if (envUrl) {
    return envUrl;
  }

  const apiBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "");
  if (apiBase) {
    return apiBase.replace(/\/api\/v1$/, "");
  }

  return "http://localhost:3000";
};

export const createSocket = (token: string) => {
  return io(resolveSocketUrl(), {
    auth: {
      token,
    },
    autoConnect: true,
  });
};

export type AppSocket = Socket;
