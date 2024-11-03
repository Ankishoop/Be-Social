import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Leftsidebar from "../Leftsidebar/Leftsidebar";
import { useSelector } from "react-redux";

function Mainlayout() {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.login);
  useEffect(() => {
    console.log("here");
    console.log("🚀 ~ App ~ isLogin:", isLoggedIn);

    if (!isLoggedIn) {
      navigate("/login");
      dispatch(setAuthUser(null));
      dispatch(setPosts([]));
    }

    if (!isLoggedIn && user) {
      navigate("/login");
    }
  }, [isLoggedIn]);

  return (
    <>
      {isLoggedIn && (
        <div className="flex">
          <Leftsidebar />
          <div className="w-full">
            <Outlet />
          </div>
        </div>
      )}
    </>
  );
}

export default Mainlayout;
