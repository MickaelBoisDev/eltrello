import { TaskDocument } from "./../types/task.interface";
import { Schema, model } from "mongoose";

const taskSchema = new Schema<TaskDocument>({
  title: {
    type: String,
    required: [true, "Title is require"],
  },
  description: {
    type: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  boardId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  columnId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});
export default model<TaskDocument>("Task", taskSchema);
