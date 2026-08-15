import mongoose, { Schema, model, Document } from "mongoose"

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  username: string
  email: string
  password: string
  role: "user" | "admin"
  token?: string
  tokenExpiration?: Date
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, unique: true, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    token: { type: String },
    tokenExpiration: { type: Date },
  },
  {
    timestamps: true,
  }
)

const User = mongoose.models.User || model<IUser>("User", userSchema)

export default User