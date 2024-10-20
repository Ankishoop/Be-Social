import React from "react";
import Post from "../Post/Post";
import { useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import useGetAllPost from "@/hooks/useGetAllPost";

function Posts() {
  const { posts, loading } = useSelector((state) => state.post);

  if (loading) {
    return <Loader2 className="animate-spin" />;
  }
  console.log("🚀 ~ Posts ~ posts:", posts.length);

  return (
    <div>
      {posts.length > 0 ? (
        posts.map((post) => {
          return <Post key={post._id} post={post} />;
        })
      ) : (
        <div>No posts available</div> // Fallback if there are no posts
      )}

      {/* {posts.map((post) => {
        <Post key={post._id} post={post} />;
      })} */}
    </div>
  );
}

export default Posts;
