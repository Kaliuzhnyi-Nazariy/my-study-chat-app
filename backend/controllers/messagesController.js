import Conversation from "../models/converstinSchema.js";
import Message from "../models/messageSchema.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participations: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participations: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    res.status(201).json(newMessage);

    await conversation.save();
    await newMessage.save();

    // await Promise.all([conversation.save(), newMessage.save()]);
  } catch (error) {
    console.log(
      "Error in controllers/messageController/sendMessage: ",
      error.message
    );
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessage = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participations: { $all: [userToChatId, senderId] },
    }).populate("messages");

    if (!conversation) return res.status(200).json([]);

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.log(
      "Error in controllers/messageController/getMessage: ",
      error.message
    );
    res.status(500).json({ error: "Internal server error" });
  }
};
