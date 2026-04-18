import { Router } from 'express';
import { getChats, createChat, deleteChat, addMessageToChat } from '../controllers/chat.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { invokeSchema } from '../validators/ai.validator.js';

const router = Router();

// Apply auth middleware to all chat routes
router.use(requireAuth);

router.get('/', getChats);
router.post('/', createChat);
router.delete('/:id', deleteChat);

// The invokeSchema validates req.body.input
router.post('/:id/messages', validateRequest(invokeSchema), addMessageToChat);

export default router;
