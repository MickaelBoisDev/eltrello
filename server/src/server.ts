import { SocketEventsEnum } from "./types/socketEvents.enum";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { Socket } from "./types/socket.interface";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import * as usersController from "./controllers/users";
import * as boardsController from "./controllers/boards";
import bodyParser from "body-parser";
import authMiddleWares from "./middlewares/auth";
import cors from "cors";
import { secret } from "./config";
import User from "./models/user";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set("toJSON", {
  virtuals: true,
  transform: (_, converted) => {
    delete converted._id;
  },
});

app.get("/", (req, res) => {
  res.send("API is UP");
});

//Users
app.post("/api/users", usersController.register);
app.post("/api/users/login", usersController.login);
app.get("/api/user", authMiddleWares, usersController.currentUser);

// Boards
app.get("/api/boards", authMiddleWares, boardsController.getBoards);
app.post("/api/boards", authMiddleWares, boardsController.createBoard);
app.get("/api/boards/:boardId", authMiddleWares, boardsController.getBoard);

io.use(async (socket: Socket, next) => {
  try {
    const token = (socket.handshake.auth.token as string) ?? "";
    const data = jwt.verify(token.split(" ")[1], secret) as {
      id: string;
      email: string;
    };
    const user = await User.findById(data.id);
    if (!user) {
      return next(new Error("Authentifaction error"));
    }
    socket.user = user;
    next();
  } catch (error) {
    next(new Error("Authenfication error"));
  }
}).on("connection", (socket) => {
  socket.on(SocketEventsEnum.boardsJoin, (data) => {
    boardsController.joinBoard(io, socket, data);
  });
  socket.on(SocketEventsEnum.boardsLeave, (data) => {
    boardsController.leaveBoard(io, socket, data);
  });
});

mongoose.connect("mongodb://localhost:27017/eltrello").then(() => {
  console.log("connectd to mongodb");
  httpServer.listen(4001, () => {
    console.log(`API is listening on port 4001`);
  });
});
