import React, { useState } from "react";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SearchProfile from "../SearchProfile/SearchProfile";

export const SearchBar = () => {
  const { User } = useSelector((state) => state.auth);
  const { isLoggedIn } = useSelector((state) => state.login);
  const [text, settext] = useState("");
  const navigate = useNavigate();
  const [seachUser, setSearchUSer] = useState([]);

  useState(() => {
    if (isLoggedIn === false && User) {
      navigate("/login");
    }
  }, []);

  const handleOnchange = (e) => {
    const inputText = e.target.value;
    console.log("🚀 ~ handleOnchange ~ inputText:", inputText);

    if (inputText.trim !== "") {
      settext(inputText);
    } else {
      settext("");
    }
  };

  const handleOnSearch = async () => {
    try {
      const resp = await axios.get(
        `https://be-socail-backend-deploy.onrender.com/api/v1/user/search?query=${text}`,
        {
          withCredentials: true,
        }
      );
      console.log("🚀 ~ handleOnSearch ~ resp:", resp);
      if (resp.data?.status == 200) {
        console.log("🚀 ~ handleOnSearch ~ resp.data.users:", resp.data.users);
        setSearchUSer(resp.data.users);
      }
    } catch (error) {}
  };

  return (
    <>
      <div className="flex flex-1 w-[80vw] relative justify-center items-center mt-1 gap-2 pl-2">
        <input
          type="text"
          className="flex-1 border border-black p-2 rounded-xl"
          placeholder="Search ...."
          onChange={handleOnchange}
          value={text}
        />
        <Button
          className=" right-0 z-10 gap-2 bg-blue-900 hover:bg-blue-950 border border-gray-500"
          disabled={text ? false : true}
          onClick={() => handleOnSearch()}
        >
          Search
          <Search />
        </Button>
      </div>
      <div>
        {seachUser.length > 0 && (
          <>
            {seachUser.map((eachuser) => {
              return <SearchProfile key={eachuser._id} searchUser={eachuser} />;
            })}
          </>
        )}
      </div>
    </>
  );
};
