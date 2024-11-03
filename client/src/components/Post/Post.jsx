import React, { useState } from "react";
import DialogComponent from "../Dailog/Dailog";
import { BookIcon, Heart, MessageCircleCodeIcon, Send } from "lucide-react";
import CommentDialog from "@/components/CommentDialog/CommenrDialog";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { setPosts } from "@/redux/postSlice";
import { useEffect } from "react";

function Post({ post }) {
  console.log("🚀 ~ Post ~ post:", post);
  // Define the handlers for each action

  const { user } = useSelector((state) => state.auth);
  const { posts } = useSelector((state) => state.post);
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
  }, []);

  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const isLiked = () => {
    return post?.likes.some((eachLike) => eachLike?._id === user._id);
  };
  console.log("🚀 ~ isLiked ~ isLiked:", isLiked());
  const [liked, setLiked] = useState(isLiked());

  const [postlike, setPostlike] = useState(post?.likes.length);

  const dispatch = useDispatch();
  const handleonComment = async () => {
    if (text.trim() === "") {
      return;
    }

    try {
      //http://localhost:8000/api/v1/post/comment/postid;
      const resp = await axios.post(
        `https://be-socail-backend-deploy.onrender.com/api/v1/post/comment/${post._id}`,
        {
          msg: text,
        },
        {
          withCredentials: true,
        }
      );

      console.log("🚀 ~ handleonComment ~ resp:", resp.data.comment);
      if (resp.data.status === 200) {
        toast.success(resp.data.msg);
        setText("");

        const newComment = resp.data?.comment;

        const updatedPosts = posts.map((eachpost) => {
          if (post._id === eachpost._id) {
            return {
              ...eachpost,
              comments: [...eachpost.comments, newComment],
            };
          } else {
            return eachpost;
          }
        });
        console.log("🚀 ~ updatedPosts ~ updatedPosts:", updatedPosts);

        dispatch(setPosts(updatedPosts));
      }
    } catch (error) {
      toast.error("Comment not Added");
    }
  };

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim() !== "") {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const unfollowHandler = async () => {
    console.log("Unfollow action executed");
    // Perform unfollow logic here

    // http://localhost:8000/api/v1/user/profile/post_author_id
    // console.log(post.author._id);

    try {
      const resp = await axios.patch(
        console.log(
          "🚀 ~ Post ~ liked:",
          liked
        )`https://be-socail-backend-deploy.onrender.com/api/v1/user/profile/${post?.author?._id}`,
        {},
        {
          withCredentials: true,
        }
      );
      if (resp.data.status == 200) {
        toast.success(resp.data.msg, {
          icon: "👀",
        });

        const updatedPosts = posts.filter((eachPost) => {
          return eachPost.author._id != post?.author?._id;
        });

        dispatch(setPosts(updatedPosts));
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const deleteHandler = async () => {
    console.log("Delete action executed");
    // Perform delete logic here

    // http://localhost:8000/api/v1/post/deletepost/postid

    if (post?.author._id != user._id) {
      return toast.error("You are not valid user");
    }

    console.log(post._id);

    try {
      const resp = await axios.delete(
        `https://be-socail-backend-deploy.onrender.com/api/v1/post/deletepost/${post._id}`,
        {
          withCredentials: true,
        }
      );

      if (resp.data.status == 200) {
        toast.success("Post Deleted SucessFully", {
          icon: "😎",
        });
        const updatedPosts = posts.filter((eachpost) => {
          return eachpost._id != post._id;
        });
        // updatedPosts
        console.log("🚀 ~ deleteHandler ~ updatedPosts:", updatedPosts);
        dispatch(setPosts(updatedPosts));
      }
    } catch (error) {
      toast.error("error in deleting");
    }
  };

  const bookmarkHandler = () => {
    console.log("Bookmark action executed");
    // Perform bookmark logic here
  };

  // Dialog content with handlers

  // function isShowOption() {
  //   return post.author._id == user._id;
  // }

  const dialogContent = [
    !(post.author._id == user._id) && {
      name: "Unfollow",
      handler: unfollowHandler,
    },
    post.author._id == user._id && {
      name: "Delete",
      handler: deleteHandler,
    },
    {
      name: "Bookmark",
      handler: bookmarkHandler,
    },
  ].filter(Boolean);

  const handleOnLikes = async () => {
    try {
      const resp = await axios.patch(
        `https://be-socail-backend-deploy.onrender.com/api/v1/post/updatelike/${post._id}`,
        {},
        {
          withCredentials: true,
        }
      );

      // const editedPost = posts.map((eachpost) => {
      //   if (eachpost._id == post._id) {
      //     eachpost?.likes.push(user._id);
      //   }
      //   return eachpost;
      // });
      // console.log("🚀 ~ editedPost ~ editedPost:", editedPost);

      if (resp.data.status == 200) {
        if (liked) {
          setPostlike((prev) => prev - 1);
        } else {
          setPostlike((prev) => prev + 1);
        }

        toast.success(resp.data.msg, {
          icon: "😊",
        });

        const updatedPost = posts.map((eachpost) => {
          if (eachpost?._id === post?._id) {
            return {
              ...eachpost,
              likes: liked
                ? post.likes.filter((eachLike) => eachLike._id !== user?._id)
                : [
                    ...post.likes,
                    {
                      _id: user._id,
                      username: user.username,
                      profilePicture: user.profilePicture,
                    },
                  ],
            };
          } else {
            return eachpost;
          }
        });
        console.log("🚀 ~ updatedPost ~ updatedPost:", updatedPost);

        // console.log("🚀 ~ handleOnLikes ~ tempLike:", post);
        setLiked(!liked);

        // const editedPost = posts.map((eachpost) => {
        //   if (eachpost._id === post._id) {
        //     return {
        //       ...eachpost,
        //       likes: tempLike,
        //     };
        //   }

        //   console.log("🚀 ~ editedPost ~ editedPost:", editedPost);
        //   return eachpost;
        // });
        // console.log("🚀 ~ editedPost ~ editedPost:", editedPost);

        dispatch(setPosts(updatedPost));
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      {isLoggedIn && (
        <div className="my-8 p-2w-full max-w-lg mx-auto border border-gray-100 p-2">
          <div className="flex items-center justify-between border-b border-gray-100 bg-slate-100 shadow-inner">
            <div className="flex items-center gap-2">
              <img
                src={post.author.profilePicture}
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
              <h1>{post.author.username}</h1>
            </div>

            <DialogComponent dialogContent={dialogContent} post={post} />
          </div>
          <div>
            <img
              src={post.image}
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
          </div>
          <div className="flex justify-between mb-2">
            <div className="flex gap-3 items-center">
              <div className="flex gap-1">
                <Heart
                  className="cursor-pointer "
                  // color="red"
                  fill={liked ? "red" : "none"}
                  onClick={handleOnLikes}
                />
                <span> {postlike}</span>
              </div>
              <div className="flex gap-1">
                <MessageCircleCodeIcon
                  className="cursor-pointer hover:text-gray-400 "
                  onClick={() => setOpen(true)}
                />
                <span>{post.comments.length}</span>
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
          <p>
            <span className="font-medium mr-2">{post.author.username}</span>
            {post.caption}
          </p>
          {post.comments.length > 0 ? (
            <span
              onClick={() => setOpen(true)}
              className="cursor-pointer text-gray-400"
            >
              View All 10 comments ....
            </span>
          ) : (
            <span>No comment yet ....</span>
          )}
          <CommentDialog
            open={open}
            setOpen={setOpen}
            post={post}
            text={text}
            setText={setText}
            handleonComment={handleonComment}
          />

          <div className="flex items-center">
            <input
              type="text"
              placeholder="Add a comment"
              value={text}
              onChange={(e) => {
                changeEventHandler(e);
              }}
              className="outline-none w-full text-sm p-4"
            />
            {text && (
              <span
                className="text-blue-700 cursor-pointer hover:text-gray-600 "
                onClick={handleonComment}
              >
                Post
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default Post;
