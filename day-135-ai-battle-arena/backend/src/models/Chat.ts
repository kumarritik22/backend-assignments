import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  id: string; // The frontend needs this mapped to frontend's temporary 'msg-1234' format
  problem: string;
  solution_1: string;
  solution_2: string;
  judge: {
    solution_1_score?: number;
    solution_2_score?: number;
    solution_1_reasoning?: string;
    solution_2_reasoning?: string;
    error?: boolean;
    message?: string;
    text?: string;
  } | null;
}

export interface IChat extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  id: { type: String, required: true },
  problem: { type: String, required: true },
  solution_1: { type: String, default: "" },
  solution_2: { type: String, default: "" },
  judge: {
    solution_1_score: Number,
    solution_2_score: Number,
    solution_1_reasoning: String,
    solution_2_reasoning: String,
    error: Boolean,
    message: String,
    text: String
  }
}, { _id: false });

const ChatSchema = new Schema<IChat>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'New Conversation'
  },
  messages: {
    type: [MessageSchema],
    default: []
  }
}, {
  timestamps: true
});

export const Chat = mongoose.model<IChat>('Chat', ChatSchema);
