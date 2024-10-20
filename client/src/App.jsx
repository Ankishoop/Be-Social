import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./components/Signup/Signup";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/Login/Login";
import Mainlayout from "./components/Mainlayout/Mainlayout";
import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";
import { useEffect } from "react";
import Cookies from "js-cookie";

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
  console.log(Cookies.get("accessToken"));
  return (
    <>
      <RouterProvider router={router} />
      {/* <ToastContainer /> */}
    </>
  );
}

export default App;
