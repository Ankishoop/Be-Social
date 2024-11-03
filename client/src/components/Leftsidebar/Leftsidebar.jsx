import axios from "axios";
import {
  AlignCenterHorizontal,
  Heart,
  Home,
  ImagePlusIcon,
  LogInIcon,
  MessageCircle,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "../CreatePost/CreatePost";
import useAuthenticated from "@/hooks/useAuthenticated";
import { useEffect } from "react";
import { setPosts } from "@/redux/postSlice";
import { setLoginUser } from "@/redux/loginSlice";
import { setSocket } from "@/redux/socketSlice";
import { setOnlineUsers } from "@/redux/chatSlice";
import { Popover, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { PopoverContent } from "@radix-ui/react-popover";

function Leftsidebar() {
  useAuthenticated();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { likeNotification } = useSelector((state) => state.rtn);
  const { user } = useSelector((store) => store.auth);
  const { isLoggedIn } = useSelector((state) => state.login);
  console.log("🚀 ~ Leftsidebar ~ isLoggedIn:", isLoggedIn);
  console.log("🚀 ~ Leftsidebar ~ user:", user);
  const [postopen, setPostopen] = useState(false);

  // if (!isLoggedIn) {
  //   navigate("/login");
  // }

  useEffect(() => {
    // console.log("here");
    // console.log("🚀 ~ App ~ isLogin:", isLoggedIn);

    if (!isLoggedIn) {
      navigate("/login");
      dispatch(setAuthUser(null));
      dispatch(setPosts([]));
    }

    if (!isLoggedIn && user) {
      navigate("/login");
    }
  }, []);

  const logoutUser = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setPosts([]));
        dispatch(setLoginUser(false));
        dispatch(setSocket(null));
        // const updatedOnlineUser = onl
        // dispatch(setOnlineUsers())
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const CreatePostHandler = () => {
    setPostopen(true);
  };
  const sidebarhandler = (textType) => {
    console.log("🚀 ~ sidebarhandler ~ textType:", textType);

    if (textType === "Logout") {
      return logoutUser();
    } else if (textType === "Create") {
      CreatePostHandler();
    } else if (textType === "Search") {
      navigate("/search");
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType == "Message") {
      navigate("/chat");
    } else if (textType === "Notification") {
      navigate("/notification");
    }
  };

  const LeftSidebarItems = [
    {
      name: "Home",
      icon: <Home />,
      link: "/",
    },
    {
      name: "Search",
      icon: <Search />,
      link: "/search",
    },
    {
      name: "Message",
      icon: <MessageCircle />,
      link: "/message",
    },
    {
      name: "Explore",
      icon: <TrendingUp />,
      link: "/explore",
    },
    {
      name: "Notification",
      icon: <Heart />,
      link: "/notification",
    },
    {
      name: "Create",
      icon: <ImagePlusIcon />,
      link: "/Create",
    },
    {
      name: "Profile",
      icon: (
        <img
          src={user ? user?.profilePicture : ""}
          style={{
            width: "40px",
            height: "40px",
            border: "none",
            borderRadius: "50%",
            objectFit: "cover",
            backgroundColor: "black",
          }}
          alt="Profile Image"
        ></img>
      ),
      link: "/profile",
    },
    {
      name: "Logout",
      icon: <LogInIcon />,
      link: "/logout",
    },
  ];
  return (
    <>
      {isLoggedIn && (
        <>
          <div className="sticky top-0 z-10 left-0 px:4 border-r border-gray-300 w-[20%] h-screen lg:w-[17%] ">
            <div className="flex flex-row items-center  mb-10">
              <AlignCenterHorizontal
                size={60}
                color="#8d2020"
                strokeWaidth={2}
              />
              <span className="text-[30px] ml-1">Be Socail</span>
            </div>
            <div>
              {LeftSidebarItems.map((item) => {
                return (
                  // <Link to={item.link} className="">
                  <div
                    onClick={() => sidebarhandler(item.name)}
                    className=" flex flex-row p-4 m-2 relative items-center gap-4  rounded-xl hover:bg-slate-200 hover:text-lg duration-200"
                  >
                    {item.icon}
                    {item.name}
                    {item.name === "Notification" &&
                      likeNotification.length > 0 && (
                        <Button
                          size="icon"
                          className="rounded-full h-5 w-5 absolute bottom-6 left-8"
                        >
                          {likeNotification.length}
                        </Button>
                      )}
                  </div>
                  // </Link>
                );
              })}
            </div>
          </div>
          <CreatePost open={postopen} setOpen={setPostopen} />
        </>
      )}
    </>
  );
}

export default Leftsidebar;
