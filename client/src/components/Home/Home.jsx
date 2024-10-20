import React from "react";
import Feed from "../Feed/Feed";
import { Outlet } from "react-router-dom";
import RightSideBar from "../RightSideBar/RightSideBar";
import useGetAllPost from "@/hooks/useGetAllPost";

function Home() {
  useGetAllPost();

  return (
    <div className="flex">
      <div className="flex-grow">
        <Feed />
        <Outlet />
      </div>
      <div>
        <RightSideBar />
      </div>
    </div>
  );
}

export default Home;
