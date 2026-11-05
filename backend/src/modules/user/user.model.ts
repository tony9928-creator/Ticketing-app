import { model, Schema } from "mongoose";
import { ROLES, User } from "./user.types";

export type UserDoc = Omit<User, "id">;

const userSchema = new Schema<UserDoc>(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    rol: { type: String, enum: [...ROLES], default: "user", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const UserModel = model<UserDoc>("User", userSchema);
