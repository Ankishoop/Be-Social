import "./App.css";
import {
  createBrowserRouter,
  RouterProvider,
  // useNavigate,
} from "react-router-dom";
import Signup from "./components/Signup/Signup";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login/Login";
import Mainlayout from "./components/Mainlayout/Mainlayout";
import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { SearchBar } from "./components/SearchBar/SearchBar";
import useAuthenticated from "./hooks/useAuthenticated";
import { useDispatch, useSelector } from "react-redux";
import Chatpage from "./components/ChatPage/Chatpage";
import { io } from "socket.io-client";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/rtnSlice";
import Notification from "./components/Notification/Notification";
// import { useNavigate } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Mainlayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/search",
        element: <SearchBar />,
      },
      {
        path: "/chat",
        element: <Chatpage />,
      },
      {
        path: "/notification",
        element: <Notification />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Signup />,
  },
]);

function App() {
  const { user } = useSelector((state) => state.auth);
  const { socket } = useSelector((state) => state.socket);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user) {
      const socketio = io("https://be-socail-backend-deploy.onrender.com/", {
        query: {
          userId: user._id,
        },
        transports: ["websocket"],
      });

      dispatch(setSocket(socketio));

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      socketio.on("notification", (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return (
    <>
      <RouterProvider router={router} />
      {/* <ToastContainer /> */}
    </>
  );
}

export default App;
