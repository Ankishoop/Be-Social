import React, { useState } from "react";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "../ui/dialog";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

function CommentDialog({ open, setOpen, post }) {
  console.log("🚀 ~ CommentDialog ~ post:", post);
  const [text, setText] = useState("");

  const changeEventHandler = (e) => {
    const tempText = e.target.value;

    if (tempText.trim() === "") {
      setText("");
    } else {
      setText(tempText);
    }
  };

  const sendMessageHandler = async () => {
    alert("button");
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl h-3/4 p-1 flex flex-col overflow-auto gap-1 bg-slate-100 shadow-sm"
      >
        {/* <VisuallyHidden>
        </VisuallyHidden> */}
        <DialogTitle></DialogTitle>
        <div className="flex flex-1 p-1">
          <div className="w-1/2 flex h-full items-center">
            <img
              src={post.image}
              alt="Post image"
              className="rounded-sm mb-2 w-full aspect-square object-contain"
            />
          </div>

          <div className="w-1/2 flex flex-col p-1">
            <div className="flex flex-col">
              <Link className="flex items-center gap-3">
                <img
                  src={post.author.profilePicture}
                  alt="Post image"
                  className="max-w-16 rounded-full border border-gray-300"
                />
                <span>{post.author.username}</span>
              </Link>
              <div>
                <span>{post.caption}</span>
              </div>
            </div>
            {/* <hr /> */}
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {post.comments.length > 0 ? (
                post.comments.map((eachComment) => {
                  return (
                    <Link className="flex gap-3 bg-gray-200 rounded-full mb-2 p-1">
                      <div className="flex gap-2  justify-center items-center  ">
                        <img
                          src={eachComment?.author?.profilePicture}
                          alt="Post image"
                          className="max-w-10 max-h-10 aspect-square rounded-full border border-gray-300 p-2 "
                        />
                        <span className="text-sm mr-1">
                          {eachComment?.author?.username}
                          {":"}
                        </span>
                      </div>

                      <div className="text-left flex items-center">
                        <span className="text-sm">{eachComment.msg}</span>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div>No comments</div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a comment"
                value={text}
                onChange={(e) => {
                  changeEventHandler(e);
                }}
                className="outline-none w-full text-sm p-3 border border-gray-300"
              />
              <Button
                variant="outline"
                onClick={sendMessageHandler}
                disabled={!text.trim()}
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CommentDialog;
