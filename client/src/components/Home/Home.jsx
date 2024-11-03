import React, { useEffect } from "react";
import Feed from "../Feed/Feed";
import { Outlet } from "react-router-dom";
import RightSideBar from "../RightSideBar/RightSideBar";
import useGetAllPost from "@/hooks/useGetAllPost";
import useGetSuggestedUsers from "@/hooks/useSuggestedUser";
import { useDispatch } from "react-redux";
import { setSelectedUser } from "@/redux/authSlice";

function Home() {
  const dispatch = useDispatch();
  useGetAllPost();
  useGetSuggestedUsers();

  useEffect(() => {
    dispatch(setSelectedUser(null));
  }, []);

  return (
    <div className="flex flex-1 w-[80vw]">
      <div className="flex-1">
        <Feed />
        {/* <Outlet /> */}
      </div>
      <div>{/* <RightSideBar /> */}</div>
    </div>
  );
}

export default Home;
