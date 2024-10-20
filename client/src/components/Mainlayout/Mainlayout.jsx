import React from "react";
import { Outlet } from "react-router-dom";
import Leftsidebar from "../Leftsidebar/Leftsidebar";

function Mainlayout() {
  return (
    <div className="flex flex-col">
      <Leftsidebar />
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default Mainlayout;
