import { createServer } from "node:http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

io.on("connection", (socket) => {
  console.log("Client connnected: ", socket.id);

  socket.on("join", (data) => {
    socket.join(String(data.tenantId));
    socket.emit("client-joined", { roomId: String(data.tenantId) });
  });
});

export default {
  httpServer,
  io,
};
