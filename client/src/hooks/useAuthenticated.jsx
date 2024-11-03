import { setLoginUser } from "@/redux/loginSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useAuthenticated = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    // dispatch(setLoading());
    const isLoggedHandler = async () => {
      try {
        const resp = await axios.get(
          "http://localhost:8000/api/v1/user/isauthenticated",
          {
            withCredentials: true,
          }
        );
        console.log("🚀 ~ fetchAllPost ~ resp:", resp.data);

        if (resp.data.status === 200) {
          dispatch(setLoginUser(true));
        }
      } catch (error) {
        // console.log(error);
        dispatch(setLoginUser(false));
      }
    };

    isLoggedHandler();
  }, [dispatch]);
};

export default useAuthenticated;
