import { Schema, model } from "mongoose";
import { UserDocument } from "../types/user.interface";
import validator from "validator";
import bcryptjs from "bcryptjs";

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: [true, "Email is require"],
      validate: [validator.isEmail, "invalid email"],
      createIndexes: { unique: true },
    },
    username: {
      type: String,
      required: [true, "Username is require"],
    },
    password: {
      type: String,
      required: [true, "Password is require"],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);
// Hash password on save / update => isolated logic
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcryptjs.genSalt(20);
    this.password = await bcryptjs.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err as Error);
  }
});

userSchema.methods.validatePassword = function (password: string) {
  return bcryptjs.compare(password, this.password);
};

export default model<UserDocument>("User", userSchema);
