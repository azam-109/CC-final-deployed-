import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";

// GET /chat/conversations — all conversations for logged in user
export const getConversations = async (req, res) => {
  try {

    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate("participants", "name role college")
      .sort({ lastMessageAt: -1 });

    // Add unread count to each conversation
    const conversationsWithUnread = await Promise.all(

      conversations.map(async (conv) => {

        const unreadCount = await Message.countDocuments({
          conversation: conv._id,

          sender: { $ne: req.user._id },

          readBy: { $ne: req.user._id },
        });

        return {
          ...conv.toObject(),
          unreadCount,
        };
      })
    );

    res.json(conversationsWithUnread);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to fetch conversations",
    });
  }
};

// GET /chat/messages/:conversationId — all messages in a conversation
export const getMessages = async (req, res) => {
  try {

    // Mark messages as read
    await Message.updateMany(
      {
        conversation: req.params.conversationId,
        sender: { $ne: req.user._id },
        readBy: { $ne: req.user._id },
      },
      {
        $push: { readBy: req.user._id },
      }
    );

    // Fetch messages
    const messages = await Message.find({
      conversation: req.params.conversationId,
    })
      .populate("sender", "name role")
      .sort({ createdAt: 1 });

    res.json(messages);

  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch messages",
    });
  }
};

// POST /chat/conversations — start or get existing conversation
export const getOrCreateConversation = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const myId = req.user._id;

    // check if conversation already exists between these two
    let conversation = await Conversation.findOne({
      participants: { $all: [myId, recipientId] },
    }).populate("participants", "name role college");

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [myId, recipientId],
      });
      conversation = await conversation.populate("participants", "name role college");
    }

    res.json(conversation);
  } catch (err) {
    res.status(500).json({ error: "Failed to create conversation" });
  }
};

export const getUnreadCount = async (req, res) => {
  try {

    // Find conversations of current user
    const conversations = await Conversation.find({
      participants: req.user._id,
    });

    const conversationIds = conversations.map(
      (c) => c._id
    );

    // Count unread messages ONLY from those conversations
    const count = await Message.countDocuments({
      conversation: { $in: conversationIds },

      sender: { $ne: req.user._id },

      readBy: { $ne: req.user._id },
    });

    res.json({ count });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Failed to get unread count",
    });
  }
};