import { type Request, type Response } from 'express';
import { Chat } from '../models/Chat.js';
import runGraph from '../ai/graph.ai.js';

export const getChats = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const userId = req.user._id;
    const chats = await Chat.find({ user: userId }).sort({ updatedAt: -1 });
    
    // Map _id to id so frontend can consume it identically
    const mappedChats = chats.map(chat => ({
      id: chat._id.toString(),
      title: chat.title,
      messages: chat.messages
    }));

    res.json({ success: true, chats: mappedChats });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createChat = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const userId = req.user._id;
    const { title } = req.body;
    
    const newChat = new Chat({
      user: userId,
      title: title || 'New Conversation',
      messages: []
    });

    await newChat.save();

    res.status(201).json({
      success: true,
      chat: {
        id: newChat._id.toString(),
        title: newChat.title,
        messages: newChat.messages
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteChat = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const userId = req.user._id;
    const id = req.params.id as string;

    const chat = await Chat.findOneAndDelete({ _id: id, user: userId } as any);
    
    if (!chat) {
      res.status(404).json({ success: false, message: 'Chat not found' });
      return;
    }

    res.json({ success: true, message: 'Chat deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addMessageToChat = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore
    const userId = req.user._id;
    const id = req.params.id as string;
    const { input, messageId } = req.body;

    const chat = await Chat.findOne({ _id: id, user: userId } as any);
    if (!chat) {
      res.status(404).json({ success: false, message: 'Chat not found' });
      return;
    }

    // Temporarily save user message optimistically so database matches what user sees
    chat.messages.push({
      id: messageId || `msg-${Date.now()}`,
      problem: input,
      solution_1: "",
      solution_2: "",
      judge: null
    });
    
    // Auto-update title if it's the first message
    if (chat.messages.length === 1) {
      chat.title = input.substring(0, 30) + (input.length > 30 ? '...' : '');
    }

    await chat.save();

    // Execute the AI pipeline
    const aiResult = await runGraph(input);

    // Update the message in the database with the real AI responses
    const lastMessage = chat.messages[chat.messages.length - 1];
    if (lastMessage) {
      if (aiResult.solution_1) lastMessage.solution_1 = aiResult.solution_1;
      if (aiResult.solution_2) lastMessage.solution_2 = aiResult.solution_2;
      if (aiResult.judge) lastMessage.judge = aiResult.judge;
    }

    await chat.save();

    res.json({
      success: true,
      message: lastMessage,
      chatTitle: chat.title
    });

  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
