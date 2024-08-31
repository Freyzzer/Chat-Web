import { Server as NetServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import { NextApiRequest, NextApiResponse } from "next";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};

export default function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket.server.io) {
    const io = new SocketIOServer(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket: Socket) => {
      console.log("A user connected", socket.id);

      // Manejar mensajes enviados por los usuarios
      socket.on("send-message", (message: { user: string, text: string }) => {
        // Reenviar el mensaje a todos los demás usuarios
        io.emit("receive-message", message);
      });

      // Manejar la desconexión del usuario
      socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id);
      });
    });
  }
  res.end();
}
