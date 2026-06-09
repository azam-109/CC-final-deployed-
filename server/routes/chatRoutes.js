import express from "express";
import {
  getConversations,
  getMessages,
  getOrCreateConversation,
  getUnreadCount,
} from "../controllers/chatController.js";
import { restrictToLoggedInUserOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/conversations", restrictToLoggedInUserOnly, getConversations);
router.get("/messages/:conversationId", restrictToLoggedInUserOnly, getMessages);
router.post("/conversations", restrictToLoggedInUserOnly, getOrCreateConversation);
router.get("/unread-count", restrictToLoggedInUserOnly,getUnreadCount);

export default router;