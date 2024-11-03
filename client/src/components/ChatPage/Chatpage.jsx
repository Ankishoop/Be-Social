import { setSelectedUser } from "@/redux/authSlice";
import { defaultProfile } from "@/utils";
import { MessageCircleMore, SendHorizonalIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Messages } from "../Messages/Messages";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";

const Chatpage = () => {
  const dispatch = useDispatch();
  const { user, suggestedUsers, selectedUser } = useSelector(
    (state) => state.auth
  );
  const { onLineUsers, messages } = useSelector((state) => state.chat);
  console.log("🚀 ~ Chatpage ~ onLineUsers:", onLineUsers);

  const [textMsg, setTextMsg] = useState("");

  // const isOnline = true;

  const handleOnUserSelect = (eachuser) => {
    dispatch(setSelectedUser(eachuser));
  };

  const sendMessageHandler = async (eachuser) => {
    console.log(eachuser?._id);
    try {
      const resp = await axios.post(
        `http://localhost:8000/api/v1/message/send/${eachuser?._id}`,
        {
          msg: textMsg,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },

          withCredentials: true,
        }
      );
      console.log("🚀 ~ sendMessageHandler ~ resp:", resp);

      if (resp.data.status === 200) {
        dispatch(setMessages([...messages, resp.data.newmessage]));
        setTextMsg("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOnKeyDown = (event, selectedUser) => {
    if (event.key === "Enter") {
      sendMessageHandler(selectedUser);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <div className="flex  h-screen w-full">
      <section>
        <h1 className="font-bold mb-4 px-3 text-xl">{user?.username}</h1>
        <hr className="mb-4 border-gray-400" />
        <div className="overflow-y-auto h-[90vh] flex-1 ">
          {suggestedUsers &&
            suggestedUsers.map((eachuser) => {
              const isOnline = onLineUsers.includes(eachuser._id);
              console.log("🚀 ~ suggestedUsers.map ~ isonLine:", isOnline);
              return (
                <div
                  className="flex items-center gap-3 p-3 hover:bg-gray-200 cursor-pointer w-80 rounded-lg"
                  onClick={() => handleOnUserSelect(eachuser)}
                >
                  <img
                    src={
                      eachuser?.profilePicture === ""
                        ? defaultProfile
                        : eachuser?.profilePicture
                    }
                    alt="Post image"
                    className="max-w-12 rounded-full bg-red-200"
                  />
                  <div className="flex flex-col gap-1">
                    <spam className="font-medium">{eachuser.username}</spam>
                    <span
                      className={`text-sm font-bold ${
                        isOnline ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isOnline ? "Online" : "Offline"}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </section>
      <div className="flex-grow flex h-full flex-1">
        {selectedUser ? (
          <div className="flex flex-col flex-1 h-full  ">
            <section>
              <div className="flex flex-row gap-3 justify-between items-center p-3 ml-3 bg-gray-100 rounded-lg">
                <div className="flex flex-row gap-3 items-center">
                  <img
                    src={selectedUser?.profilePicture}
                    alt="User profile"
                    className="max-w-12 rounded-full bg-red-200"
                  />
                  <span>{selectedUser.username}</span>
                </div>
                <Button>View Profile</Button>
              </div>
            </section>
            <Messages selectUser={selectedUser} />
            <div className="flex w-full justify-center items-center  ">
              <div className="flex w-full justify-center items-center gap-3 mb-3 ml-3 mt-3">
                <input
                  type="text"
                  className="flex-grow outline-none p-3 border border-black rounded-lg "
                  placeholder="Messages..."
                  value={textMsg}
                  onChange={(e) => setTextMsg(e.target.value)}
                  onKeyDown={(e) => handleOnKeyDown(e, selectedUser)}
                />
                <Button
                  className="p-3 mr-3"
                  onClick={() => sendMessageHandler(selectedUser)}
                >
                  <SendHorizonalIcon />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center gap-3 flex-1">
            <MessageCircleMore size={64} />
            <span> Select Conversation</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatpage;
