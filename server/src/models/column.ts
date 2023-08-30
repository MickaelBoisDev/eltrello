import { ColumnDocument } from "./../types/column.interface";
import { Schema, model } from "mongoose";

const columnSchema = new Schema<ColumnDocument>({
  title: {
    type: String,
    required: [true, "Title is require"],
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  boardId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});
export default model<ColumnDocument>("Column", columnSchema);
