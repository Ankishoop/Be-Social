import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { setAuthUser } from "@/redux/authSlice";

const SearchProfile = (props) => {
  const defaultProfile =
    "https://res.cloudinary.com/dgxco6pjj/image/upload/v1729765925/IG_awvgf5.jpg";
  const { user } = useSelector((state) => state.auth);
  //   const { posts } = useSelector((state) => state.posts);
  console.log("🚀 ~ SearchProfile ~ User:", user);
  const searchUser = props.searchUser;
  console.log("🚀 ~ SearchProfile ~ searchuser:", searchUser);
  console.log(user.following.includes(searchUser._id));
  const [isFollow, setIsFollow] = useState(
    user.following.includes(searchUser._id)
  );
  console.log(
    "🚀 ~ SearchProfile ~ isFollow:",
    isFollow,
    user.following.includes(searchUser._id)
  );

  const isUser = searchUser._id === user._id;

  const dispatch = useDispatch();

  const unfollowHandler = async () => {
    console.log("Unfollow action executed");
    // Perform unfollow logic here

    // http://localhost:8000/api/v1/user/profile/post_author_id
    // console.log(post.author._id);

    try {
      const resp = await axios.patch(
        `https://be-socail-backend-deploy.onrender.com/api/v1/user/profile/${searchUser?._id}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (resp.data.status == 200) {
        toast.success(resp.data.msg, {
          icon: "👀",
        });

        // user.following.includes(searchUser._id);

        if (isFollow) {
          //unfollow -> remove
          const updated_user = {
            ...user,
            following: user.following.filter((eachuser) => {
              return eachuser != searchUser._id;
            }),
          };
          console.log("🚀 ~ unfollowHandler ~ updated_user:", updated_user);
          dispatch(setAuthUser(updated_user));
        } else {
          // follow -> add
          const updated_user = {
            ...user,
            following: [...user.following, searchUser._id],
          };
          console.log("🚀 ~ unfollowHandler ~ updated_user:", updated_user);
          dispatch(setAuthUser(updated_user));
        }

        setIsFollow(!isFollow);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="flex justify-between gap-2 rounded-lg items-center border border-gray-300 p-4 ml-3 mt-2 shadow-lg">
      <div className="flex items-center gap-5">
        <img
          src={
            searchUser?.profilePicture === ""
              ? defaultProfile
              : searchUser?.profilePicture
          }
          alt="Post image"
          className="max-w-12 rounded-full bg-red-200"
        />
        <h1>{searchUser.username}</h1>
      </div>
      <div className="mr-3">
        {isFollow ? (
          <Button
            className="bg-transparent text-black border-2 border-black hover:text-white"
            onClick={() => unfollowHandler()}
          >
            Unfollow
          </Button>
        ) : (
          !isUser && (
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={() => unfollowHandler()}
            >
              Follow
            </Button>
          )
        )}
      </div>
    </div>
  );
};

export default SearchProfile;
