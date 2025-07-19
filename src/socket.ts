import { createServer } from "node:http";
import { Server } from "socket.io";
import config from "config";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: config.get("websocket.origin"),
  },
});

io.on("connection", (socket) => {
  console.log("Client connnected: ", socket.id);

  socket.on("join", (data) => {
    socket.join(String(data.tenantId));
    console.log(io.of("/").adapter.rooms)
    socket.emit("client-joined", { roomId: String(data.tenantId) });
  });
});

export default {
  httpServer,
  io,
};
