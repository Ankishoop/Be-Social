import mongoose from "mongoose";

const Schema = mongoose.Schema;

const conversationSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "message",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Conversation = mongoose.model("Conversation", conversationSchema);
