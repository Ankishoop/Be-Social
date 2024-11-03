import { Conversation } from "../Models/conversation.model.js";
import { Message } from "../Models/message.model.js";
import { getSocketId, io } from "../Socket/socket.js";

const sendmessage = async (req, res) => {
  try {
    //senderId --> msg send krne wala
    // reciverId -->  msg recieve krne wala

    const senderId = req.logged_in_user._id;
    const receiverId = req.params.receiverId;
    const { msg } = req.body;
    console.log("🚀 ~ sendmessage ~ msg:", msg);

    let conversation = await Conversation.findOne({
      participants: {
        $all: [senderId, receiverId],
      },
    });

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

    //implement socket io for real time data transferc

    //established conversation if not started
    const recieverSocketId = getSocketId(receiverId);
    console.log("🚀 ~ sendmessage ~ recieverSocket:", recieverSocketId);

    if (recieverSocketId) {
      io.to(recieverSocketId).emit("newMessage", newmessage);
    }

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

    console.log("getmessage");

    // const conversation = await Conversation.findOne({
    //   participants: {
    //     $all: [receiverId, senderId],
    //   },
    // });

    const conversation = await Conversation.findOne({
      participants: {
        $all: [receiverId, senderId],
      },
    }).populate({
      path: "messages",
      options: { sort: { createdAt: 1 } }, // Correct sorting syntax
    });

    console.log("🚀 ~ getMessage ~ conversation:", conversation);

    // const updated_conversation = await conversation.populate({
    //   path: "messages",
    // });
    // console.log(
    //   "🚀 ~ getMessage ~ updated_conversation:",
    //   updated_conversation
    // );
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
