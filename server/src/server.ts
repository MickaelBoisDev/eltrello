import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import * as usersController from "./controllers/users";
import bodyParser from "body-parser";
import authMiddleWares from './middlewares/auth'
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("API is UP");
});

app.post("/api/users", usersController.register);
app.post("/api/users/login", usersController.login);
app.get("/api/user", authMiddleWares, usersController.currentUser);

io.on("connection", () => {
    console.log("connect");
});

mongoose.connect("mongodb://localhost:27017/eltrello").then(() => {
    console.log("connectd to mongodb");
    httpServer.listen(4001, () => {
        console.log(`API is listening on port 4001`);
    });
});
