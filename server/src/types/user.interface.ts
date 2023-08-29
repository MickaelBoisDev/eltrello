import { Document } from "mongoose";
export interface User {
  email: string;
  username: string;
  password: string;
  createAt: Date;
  updatedAt: Date;
}

export interface UserDocument extends User, Document {
  validatePassword(param1: string): Promise<boolean>;
}
