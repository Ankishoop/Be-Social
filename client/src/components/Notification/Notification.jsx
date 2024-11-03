import {
  setLikeNotification,
  setLikeNotificationAfterView,
} from "@/redux/rtnSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Notification = () => {
  const { likeNotification } = useSelector((state) => state.rtn);
  const { posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(setLikeNotificationAfterView([]));
    };
  }, []);

  return (
    <>
      <div className="flex bg-gray-50  justify-center items-center p-4">
        <h1 className="flex justify-center items-center font-bold text-xl">
          Notifications
        </h1>
      </div>
      {likeNotification && likeNotification.length > 0 ? (
        <div>
          {likeNotification.map((notification) => {
            const notification_post = posts.find((post) => {
              return post._id === notification.postId;
            });
            return (
              <div className="flex gap-3 m-3 border border-gray-100 shadow-sm p-2 items-center ">
                <img
                  src={notification_post?.image}
                  alt="author Post"
                  className="rounded-lg max-w-[62px] max-h-[62px] aspect-square object-contain"
                />
                <div>
                  <span>{notification.userDetails?.username + " "}</span>
                  liked your Post
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="w-full h-[80%] flex justify-center items-center overflow-x-hidden">
          No Notification Yet
        </div>
      )}
    </>
  );
};

export default Notification;
