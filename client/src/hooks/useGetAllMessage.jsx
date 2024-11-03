import { setMessages } from "@/redux/chatSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllMessage = () => {
  const dispatch = useDispatch();

  const { selectedUser } = useSelector((state) => state.auth);
  console.log("🚀 ~ useGetAllMessage ~ selectedUser:", selectedUser);
  useEffect(() => {
    // dispatch(setLoading());
    const fetchAllMessages = async () => {
      try {
        const resp = await axios.get(
          `http://localhost:8000/api/v1/message/get/${selectedUser?._id}`,
          {
            withCredentials: true,
          }
        );
        console.log("🚀 ~ fetchAllMessage ~ resp:", resp.data);

        if (resp.data.status === 200) {
          dispatch(setMessages(resp.data.messages));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllMessages();
  }, [dispatch, selectedUser]);
};

export default useGetAllMessage;
