import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { toast } from "react-toastify";
import { readFileAsDataURL } from "@/lib/utils";
import { Button } from "../ui/button";
import axios from "axios";
import {
  BookIcon,
  Heart,
  Loader2,
  MessageCircleCodeIcon,
  Send,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addPost, setPosts } from "@/redux/postSlice";

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();

  const { user } = useSelector((state) => state.auth);
  // console.log("🚀 ~ CreatePost ~ user:", user);

  const [step, setStep] = useState(1);
  const [postImage, setPostImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [newImage, setNewImage] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    setPostImage(null);
    setImagePreview("");
    setCaption("");
    setStep(1);
    setNewImage("");
  }, [open]);

  const createPostHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("caption", e.target.caption.value);
    formData.append("postImage", postImage);
    console.log("🚀 ~ createPostHandler ~ formData:", formData);

    setLoading(true);
    const resp = await axios.post(
      "http://localhost:8000/api/v1/post/addpost",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    console.log("🚀 ~ createPostHandler ~ resp:", resp);

    if (resp.data.status == 200) {
      setStep(2);
      setNewImage(resp.data.post.image);
      toast.success("User Post SuccessFully", {
        icon: "🎉",
      });

      dispatch(addPost(resp.data.post));

      setTimeout(() => {
        setOpen(false);
      }, 5000);
    }

    try {
    } catch (error) {
      toast.error("error");
    } finally {
      setLoading(false);
    }
  };

  const fileChangeHandler = async (e) => {
    // console.log("🚀 ~ fileChangeHandler ~ e:", e.target.files[0]);
    // setPostImage(e.target?.files[0]);

    const file = e.target.files?.[0];

    if (file) {
      setPostImage(file);
      // const dataUrl = await readFileAsDataURL(file);
      // console.log("🚀 ~ fileChangeHandler ~ dataUrl:", dataUrl);
      // setImagePreview(dataUrl);
      setImagePreview(URL.createObjectURL(file)); // Preview the image
    } else {
      setImagePreview("");
    }
  };

  return (
    <Dialog open={open} className="p-10">
      {step === 1 ? (
        <DialogContent
          onInteractOutside={() => setOpen(false)}
          // className="max-w-5xl h-3/4 p-1 flex flex-col overflow-auto gap-1"
        >
          <DialogTitle></DialogTitle>
          <DialogHeader className="text-center font-semibold">
            Create new Post
          </DialogHeader>

          <button
            className="absolute right-1 bg-gray-900 text-white border rounded-2xl p-2 hover:bg-red-500 z-10 w-11 h-11"
            onClick={() => setOpen(false)}
          >
            X
          </button>

          <div className="flex gap-3 items-center">
            <img
              src={user.profilePicture}
              alt="Post image"
              className="max-w-16 rounded-lg"
              // style={{
              //   width: "40px",
              //   height: "40px",
              //   border: "none",
              //   borderRadius: "50%",
              //   objectFit: "cover",
              //   backgroundColor: "black",
              // }}
            />
            <div>
              <h1 className="font-semibold text-xs">{user.username}</h1>
              <span className="text-sm text-gray-300">{user.bio}</span>
            </div>
          </div>

          <form onSubmit={createPostHandler} className="flex flex-col">
            <div className="flex justify-center items-center">
              <input
                type="file"
                name="image"
                onChange={fileChangeHandler}
                className="hidden"
                ref={imageRef}
              />
              {/* <label>Caption:</label> */}
              <Button
                type="button"
                onClick={() => imageRef.current.click()}
                className="text-center p-2 mb-2 "
              >
                Select From Computor
              </Button>
            </div>
            {imagePreview && (
              <div>
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="w-full h-64 flex items-center justify-center pb-2 aspect-square object-contain"
                />
              </div>
            )}
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Add caption....."
                name="caption"
                className="focus-visible:ring-transparent border-none w-full p-1"
              ></input>

              {!loading ? (
                <input
                  type="submit"
                  value="Post"
                  className="p-2 border rounded-lg bg-blue-600 text-white cursor-pointer hover:bg-blue-700 font-medium hover:font-bold"
                />
              ) : (
                <Loader2 className="animate-spin mr-2 z-10 self-center" />
              )}
            </div>
          </form>
        </DialogContent>
      ) : (
        <DialogContent
          onInteractOutside={() => setOpen(false)}
          // className="max-w-5xl h-3/4 p-1 flex flex-col overflow-auto gap-1"
        >
          <DialogTitle></DialogTitle>
          <DialogHeader className="text-center font-semibold">
            New Post Added Successfully
          </DialogHeader>

          <button
            className="absolute right-1 bg-gray-900 text-white border rounded-2xl p-2 hover:bg-red-500 z-10 w-11 h-11"
            onClick={() => setOpen(false)}
          >
            X
          </button>

          {/* <div className="flex gap-3 items-center">
            <img
              src="https://ankishkhandelwal.netlify.app/assets/purple2-CaAtF8ZA.png"
              alt="Post image"
              className="max-w-16 rounded-lg"
              // style={{
              //   width: "40px",
              //   height: "40px",
              //   border: "none",
              //   borderRadius: "50%",
              //   objectFit: "cover",
              //   backgroundColor: "black",
              // }}
            />
            <div>
              <h1 className="font-semibold text-xs">Username</h1>
              <span className="text-sm text-gray-300">Bio Here</span>
            </div>
          </div>

          <div>
            <img
              src={newImage}
              alt="Image Preview"
              className="w-full h-64 flex items-center justify-center pb-2 aspect-square object-contain"
            />
          </div> */}

          <div className="my-8 p-2w-full max-w-sm mx-auto border border-gray-100 p-2">
            <div className="flex items-center justify-between border-b border-gray-100 bg-slate-100 shadow-inner">
              <div className="flex items-center gap-2">
                <img
                  src="https://ankishkhandelwal.netlify.app/assets/purple2-CaAtF8ZA.png"
                  alt="Post image"
                  className="max-w-16 rounded-lg"
                  // style={{
                  //   width: "40px",
                  //   height: "40px",
                  //   border: "none",
                  //   borderRadius: "50%",
                  //   objectFit: "cover",
                  //   backgroundColor: "black",
                  // }}
                />
                <h1>username</h1>
              </div>

              {/* <DialogComponent dialogContent={dialogContent} /> */}
            </div>
            <div>
              <img
                src={newImage}
                //  style={{
                //    width: "40px",
                //    height: "40px",
                //    border: "none",
                //    borderRadius: "50%",
                //    objectFit: "cover",
                //    backgroundColor: "black",
                //  }}
                className="rounded-sm mb-2 w-full aspect-square object-contain"
              />
              <div>
                <p>
                  <span className="font-medium mr-2">Username</span>
                  caption
                </p>
              </div>
            </div>
            <div className="flex justify-between mb-2">
              <div className="flex gap-3 items-center">
                <div className="flex gap-1">
                  <Heart className="cursor-pointer " />
                  {/* <span> 10</span> */}
                </div>
                <div className="flex gap-1">
                  <MessageCircleCodeIcon
                  // className="hover:text-gray-400 "
                  // onClick={() => setOpen(true)}
                  />
                  {/* <span>10</span> */}
                </div>
                <div>
                  <Send
                    size={20}
                    className="cursor-pointer hover:text-gray-400 "
                  />
                </div>
              </div>

              <div>
                <BookIcon fill="transparent" />
              </div>
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};

export default CreatePost;
