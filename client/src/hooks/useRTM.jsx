import { setMessages } from "@/redux/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useRTM = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.socket);
  const { messages } = useSelector((state) => state.chat);
  useEffect(() => {
    socket?.on("newMessage", (msg) => {
      console.log("🚀 ~ socket?.on ~ msg:", msg);
      dispatch(setMessages([...messages, msg]));
    });

    return () => {
      socket?.off("newMessages");
    };
  }, [messages, setMessages]);
};

export default useRTM;
