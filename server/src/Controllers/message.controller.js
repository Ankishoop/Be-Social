import { Conversation } from "../Models/conversation.model.js";
import { Message } from "../Models/message.model.js";

const sendmessage = async (req, res) => {
  try {
    //senderId --> msg send krne wala
    // reciverId -->  msg recieve krne wala

    const senderId = req.logged_in_user._id;
    const receiverId = req.params.recieverId;
    const { msg } = req.body;

    let conversation = await Conversation.findOne({
      participants: {
        $all: { senderId, receiverId },
      },
    });

    //established conversation if not started

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newmessage = await Message.create({
      senderId,
      receiverId,
      msg,
    });

    conversation.messages.push(newmessage._id);

    await conversation.save();
    console.log("🚀 ~ sendmessage ~ conversation:", conversation);

    //implement socket io for real time data transfer

    return res.status(200).json({
      msg: "message sent",
      status: 200,
      newmessage,
    });
  } catch (error) {
    console.log(error);
  }
};

const getMessage = async (req, res) => {
  try {
    const senderId = req.logged_in_user._id;
    const receiverId = req.params.receiverId;

    const conversation = await Conversation.findOne({
      participants: {
        $all: { receiverId, senderId },
      },
    });
    console.log("🚀 ~ getMessage ~ conversation:", conversation);

    if (!conversation) {
      return res.status(200).json({
        messages: [],
        status: 200,
      });
    }

    return res.status(200).json({
      status: 200,
      messages: conversation?.messages,
    });
  } catch (error) {}
};

export { sendmessage, getMessage };
