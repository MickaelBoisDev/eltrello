import { NextFunction, Response } from "express";
import TaskModel from "../models/task";
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import { Server } from "socket.io";
import { Socket } from "../types/socket.interface";
import { SocketEventsEnum } from "../types/socketEvents.enum";
import { getErrorMessage } from "../helper";

export const getTasks = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const tasks = await TaskModel.find({
      boardId: req.params.boardId,
    });
    res.send(tasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (
  io: Server,
  socket: Socket,
  data: {
    boardId: string;
    columnId: string;
    title: string;
  }
) => {
  try {
    if (!socket.user) {
      socket.emit(
        SocketEventsEnum.tasksCreateFailure,
        "User is not authorized"
      );
      return;
    }
    const newTask = new TaskModel({
      title: data.title,
      boardId: data.boardId,
      columnId: data.columnId,
      userId: socket.user.id,
    });
    const savedTask = await newTask.save();
    io.to(data.boardId).emit(SocketEventsEnum.tasksCreateSuccess, savedTask);
  } catch (error) {
    socket.emit(SocketEventsEnum.tasksCreateFailure, getErrorMessage(error));
  }
};
