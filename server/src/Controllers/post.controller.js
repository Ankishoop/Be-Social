// caption , image , author ,likes ,comments

import { populate } from "dotenv";
import { Comment } from "../Models/comment.model.js";
import { Post } from "../Models/post.model.js";
import { User } from "../models/user.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../Utils/cloudinary.js";
// import { highDtolowD } from "../Utils/sharp.js";

const addPost = async (req, res) => {
  const user = req.logged_in_user;

  const { caption } = req.body;

  const postImage = req.file;
  // console.log("🚀 ~ addPost ~ postImage:", postImage);

  if (!postImage) {
    res.status(400).json({
      msg: "image in required",
      status: 400,
    });
  }

  const postlocalpath = postImage?.path;

  const postcloudinaryUrl = await uploadOnCloudinary(postlocalpath);
  console.log("🚀 ~ addPost ~ postcloudinaryUrl:", postcloudinaryUrl);

  const post = await Post.create({
    caption,
    image: postcloudinaryUrl?.url,
    author: user?._id,
  });

  console.log("🚀 ~ addPost ~ post:", post);
  const ExistedUser = await User.updateOne(
    { _id: { $eq: user._id } },
    {
      $push: {
        posts: post._id,
      },
    },
    {
      new: true,
    }
  );
  console.log("🚀 ~ addPost ~ ExistedUser:", ExistedUser);

  const postwithdetails = await post.populate("author", "-password");
  console.log("🚀 ~ addPost ~ postwithdetails:", postwithdetails);

  //TODO: Sharp can be used to resize image:
  //1: in multer memorystorage in used
  //2: take image.buffer -----> resize using sharp
  //3: response is buffer -->
  //4: upload to cloudinay url

  // const optimizedImageBuffer = await highDtolowD(postImage, 800, 800, "fit");
  // console.log("🚀 ~ addPost ~ optimizedImageBuffer:", optimizedImageBuffer);
  // const FileUrl = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
  //   "base64"
  // )}`;
  // console.log("🚀 ~ addPost ~ FileUrl:", FileUrl);
  // const postcloudinaryUrl = await uploadOnCloudinary(FileUrl);
  // console.log("🚀 ~ addPost ~ postcloudinaryUrl:", postcloudinaryUrl);

  res.status(200).json({
    msg: "image upload",
    status: 200,
    post,
  });
};

const deletePost = async (req, res) => {
  //remove comments also --> comment find krne hai where

  try {
    const user = req.logged_in_user;
    console.log("🚀 ~ deletePost ~ user:", user);
    const postId = req.params.postId;
    console.log("🚀 ~ deletePost ~ postId:", postId);

    // delete the post --> get url from
    const post = await Post.findById(postId);
    console.log("🚀 ~ deletePost ~ post:", post);
    if (!post) {
      res.status(400).json({
        msg: "post not Found",
        status: 400,
      });
    }

    // console.log(typeof user._id);
    // console.log(typeof post.author);

    if (user._id.toString() !== post.author.toString()) {
      res.status(400).json({
        msg: "not valid user",
        status: 400,
      });
    }

    const cloudinaryUrl = post.image;

    const Previous_image = await deleteFromCloudinary(cloudinaryUrl);
    console.log("🚀 ~ deletePost ~ Previous_image:", Previous_image);

    //delete the post document
    const isDeleted = await Post.deleteOne({ _id: postId });
    console.log("🚀 ~ deletePost ~ isDeleted:", isDeleted);

    if (isDeleted.acknowledged == false) {
      res.status(400).json({
        msg: "Error While deleting",
      });
    }

    //comments where postId eqaul delete all

    await Comment.deleteMany({ post: postId });

    const ExistedUser = await User.updateOne(
      { _id: { $eq: user._id } },
      {
        $pull: {
          posts: postId,
        },
      }
    );
    console.log("🚀 ~ deletePost ~ ExistedUser:", ExistedUser);

    await User.updateMany(
      { bookmarks: { $in: [postId] } },
      {
        $pull: {
          bookmarks: postId,
        },
      }
    );

    res.status(200).json({
      msg: "post Deleted",
      status: 200,
    });
  } catch (error) {
    console.log(error);
  }
};

const likeandunlike = async (req, res) => {
  // loggedin user= -->like
  // postId
  //like user_id push;
  //unlike user_id pull;

  try {
    const user = req.logged_in_user;
    const postId = req.params.postId; // id

    const post = await Post.findById(postId);
    console.log("🚀 ~ likeandunlike ~ post:", post);

    if (!post) {
      res.status(400).json({
        msg: "Psot not find",
        status: 400,
      });
    }

    const isliked = post.likes.includes(user._id);
    console.log("🚀 ~ likeandunlike ~ isliked:", isliked);

    if (isliked) {
      //already liked --> means want to unlike --> unlike post

      const updatedpost = await Post.findByIdAndUpdate(
        postId,
        {
          $pull: {
            likes: user._id,
          },
        },
        {
          new: true,
        }
      );
      console.log("🚀 ~ likeandunlike ~ updatedpost:", updatedpost);
      await updatedpost.populate({ path: "likes", select: "-password" });
      res.status(200).json({
        msg: `user unlike`,
        status: 200,
        updatedpost,
      });
    } else {
      //not liked --> means want to like --> like post

      const updatedpost = await Post.findByIdAndUpdate(
        postId,
        {
          $push: {
            likes: user._id,
          },
        },
        {
          new: true,
        }
      );
      console.log("🚀 ~ likeandunlike ~ updatedpost:", updatedpost);
      await updatedpost.populate({ path: "likes", select: "-password" });
      res.status(200).json({
        msg: `user like`,
        status: 200,
        updatedpost,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

// const commentonpost = async (req, res) => {
//   // logged in
//   const user = req.logged_in_user;
//   const postId = req.params.postId;
//   const {}

//   const post = await Post.findById(postId);

//   if (!post) {
//     res.status(400).json({
//       msg: "Post not find",
//       status: 400,
//     });
//   }

//   Comment.create()

// };

const getAllpost = async (req, res) => {
  // person logged in user following sari post required hai + self post --> sorted according to time

  const user = req.logged_in_user;

  // const ExistedUser = await User.findById(user._id).select("-password");
  const ExistedUser = await User.findById(user._id)
    .select("-password")
    .populate("following");

  // logged in user ->follwing ;
  if (!ExistedUser) {
    res.status(400).json({
      msg: "User not found",
      status: 400,
    });
  }

  const followingIds = ExistedUser.following.map(
    (followingUser) => followingUser._id
  );
  console.log("🚀 ~ getAllpost ~ followingIds:", followingIds);
  followingIds.push(ExistedUser._id); // Include logged-in user

  //following ->userId

  const posts = await Post.find({ author: { $in: followingIds } })
    .sort({ createdAt: -1 }) // Sort by most recent first
    .populate({ path: "author", select: "username profilePicture " }) // Optionally populate author details
    .populate({ path: "likes", select: "username profilePicture" }) // Optionally populate likes
    .populate({
      path: "comments",
      $sort: { createdAt: -1 },
      populate: { path: "author", select: "username profilePicture" },
    }); // Optionally populate comments
  console.log("🚀 ~ getAllpost  ~ posts:", posts);

  res.status(200).json({
    msg: "All post",
    posts,
    status: 200,
  });
};

const getuserpost = async (req, res) => {
  const user = req.logged_in_user;

  const userposts = await Post.find({ author: user._id })
    .sort({ createdAt: -1 })
    .populate({ path: "author", select: "username profilePicture" })
    .populate({ path: "likes", select: "username profilePicture" })
    .populate({
      path: "comments",
      $sort: { createdAt: -1 },
      populate: { path: "author", select: "username profilePicture" },
    });
  console.log("🚀 ~ getuserpost ~ userposts:", userposts);

  let userpostsdetails = userposts.map((post) => {
    return {
      ...post._doc,
      no_of_likes: post.likes.length,
      no_of_comments: post.comments.length,
    };
  });
  console.log("🚀 ~ userpostsdetails ~ userpostsdetails:", userpostsdetails);

  res.status(200).json({
    msg: "user posts",
    status: 200,
    userpostsdetails,
  });
};

const addcomment = async (req, res) => {
  // 1: logged in
  //2: postId
  //3: comment -> author ? // msg ? // postid set

  try {
    const user = req.logged_in_user;
    console.log("🚀 ~ addcomment ~ user:", user);
    const postId = req.params.postId;
    console.log("🚀 ~ addcomment ~ postId:", postId);
    const { msg } = req.body;
    console.log("🚀 ~ addcomment ~ msg:", msg);

    const post = await Post.findById(postId);

    if (!post) {
      res.status(401).json({
        msg: "post not found",
        status: 401,
      });
    }

    const comment = await Comment.create({
      msg,
      author: user._id,
      post: post._id,
    });
    console.log("🚀 ~ addcomment ~ comment:", comment);

    await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    res.status(200).json({
      msg: "comment added",
      status: 200,
      comment,
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllcommentsofpost = async (req, res) => {
  const postId = req.params.postId;

  const post = await Post.findById(postId).populate({
    path: "comments",
    $sort: { createdAt: -1 },
    populate: { path: "author", select: "username profilePicture" },
  });
  console.log("🚀 ~ post ~ post:", post);

  const updatepost = {
    ...post._doc,
    no_of_comments: post.comments.length,
  };

  if (!post) {
    res.status(401).json({
      msg: "post not found",
      status: 401,
    });
  }

  res.status(200).json({
    msg: "All post",
    status: 200,
    updatepost,
  });
};

const bookmarkpost = async (req, res) => {
  try {
    const user = req.logged_in_user;
    const postId = req.params.postId;

    const post = await Post.findById(postId);

    if (!post) {
      res.status(401).json({
        msg: "post not found",
        status: 401,
      });
    }

    const ExistedUser = await User.findById(user._id);
    const isBookmarked = ExistedUser.bookmarks.includes(post._id);

    if (isBookmarked) {
      // remove bookmark

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          $pull: {
            bookmarks: postId,
          },
        },
        {
          new: true,
        }
      );
      console.log("🚀 ~ bookmarkpost ~ updatedUser:", updatedUser);

      res.status(200).json({
        msg: "remove from bookmark",
        status: 200,
        updatedUser,
      });
    } else {
      // add bookmark

      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          $push: {
            bookmarks: postId,
          },
        },
        {
          new: true,
        }
      );
      console.log("🚀 ~ bookmarkpost ~ updatedUser:", updatedUser);

      res.status(200).json({
        msg: "post bookmark",
        status: 200,
        updatedUser,
      });
    }
  } catch (error) {
    console.loq(error);
  }
};

const userbookmarkpost = async (req, res) => {
  try {
    const user = req.logged_in_user;

    const ExistedUser = await User.findById(user._id).populate({
      path: "bookmarks",
      populate: [
        { path: "author", select: "username profilePicture" }, // Populates the author of each bookmark
        { path: "likes", select: "username profilePicture" }, // Populates the likes array of each bookmark
        {
          path: "comments",
          populate: [
            { path: "author", select: "username profilePicture" }, // Populates the author of each comment
          ],
        },
      ],
    });
    console.log("🚀 ~ ExistedUser ~ ExistedUser:", ExistedUser);
  } catch (error) {
    console.log(error);
  }
};

export {
  addPost,
  deletePost,
  likeandunlike,
  getAllpost,
  getuserpost,
  addcomment,
  getAllcommentsofpost,
  bookmarkpost,
  userbookmarkpost,
};
