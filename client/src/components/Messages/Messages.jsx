import useGetAllMessage from "@/hooks/useGetAllMessage";
import useRTM from "@/hooks/useRTM";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

export const Messages = ({ selectUser }) => {
  // con
  useRTM();
  useGetAllMessage();
  const { messages } = useSelector((state) => state.chat);
  console.log("🚀 ~ Messages ~ messages:", messages);
  const { user } = useSelector((state) => state.auth);
  const messageSectionRef = useRef(null);

  useEffect(() => {
    if (messageSectionRef.current) {
      messageSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto mt-3 scroll-auto">
      <div className="flex flex-col gap-3 ">
        {messages &&
          messages.map((message) => {
            return (
              <div
                className={`flex gap-2 ${
                  message?.senderId === user._id
                    ? "justify-end mr-3"
                    : "justify-start ml-3"
                }`}
                ref={messageSectionRef}
              >
                <span
                  className={`p-3 w-[20%] flex-wrap ${
                    message?.senderId === user._id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-black"
                  } rounded-lg `}
                >
                  {message.msg}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};
