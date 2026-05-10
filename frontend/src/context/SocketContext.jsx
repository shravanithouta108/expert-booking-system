import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
    socketRef.current = io(SOCKET_URL, { withCredentials: true });

    socketRef.current.on("connect", () => setConnected(true));
    socketRef.current.on("disconnect", () => setConnected(false));

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used inside SocketProvider");
  return ctx;
};
