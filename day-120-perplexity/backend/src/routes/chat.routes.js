import { Router } from "express";
import { sendMessage, getChats, getMessages, deleteChat } from "../controllers/chat.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const chatRouter = Router();

// @route POST /api/chats/message
// @description to create messages with title
chatRouter.post("/message", authUser, sendMessage);

// @route GET /api/chats/
// @description to get all the chats.
chatRouter.get("/", authUser, getChats);

// @route GET /api/chats/:chatId/messages
// @description to get all the messages of logged in user.
chatRouter.get("/:chatId/messages", authUser, getMessages);

// @route 
chatRouter.delete("/delete/:chatId/", authUser, deleteChat)

export default chatRouter