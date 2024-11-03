import { setLoading, setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLoading());
    const fetchAllPost = async () => {
      try {
        const resp = await axios.get(
          "https://be-socail-backend-deploy.onrender.com/api/v1/post/allposts",
          {
            withCredentials: true,
          }
        );
        console.log("🚀 ~ fetchAllPost ~ resp:", resp.data);

        if (resp.data.status === 200) {
          dispatch(setPosts(resp.data.posts));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllPost();
  }, [dispatch]);
};

export default useGetAllPost;
