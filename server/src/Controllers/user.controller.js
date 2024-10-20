import { User } from "../models/user.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../Utils/cloudinary.js";

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "None", // Allow cross-origin
};
// const options = {
//   httpOnly: false,
//   secure: false,
//   sameSite: "lax", // Allow cross-origin
// };

const register = async (req, res) => {
  // console.log(":hello");
  try {
    const { username, email, password } = req.body;

    console.log("🚀 ~ register ~  req.body:", req.body);

    // return true if empty else if any of all is not empty return false;
    if (
      [username, email, password].some((element) => {
        return element.trim() === "";
      })
    ) {
      return res
        .status(401)
        .json({ message: "Fill every field", success: false });
    }

    const ExistedUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (ExistedUser) {
      return res
        .status(401)
        .json({ message: "user already exist", success: false });
    }

    const newUser = await User.create({
      username,
      email,
      password,
    });
    console.log("🚀 ~ register ~  :", newUser);

    res.status(201).json({
      msg: "User register successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🚀 ~ login ~ req.body:", req.body);

    // return true if empty else if any of all is not empty return false;
    if (
      [email, password].some((element) => {
        return element.trim() === "";
      })
    ) {
      return res
        .status(401)
        .json({ message: "Fill every field", success: false });
    }

    const ExistedUser = await User.findOne({ email });
    console.log("🚀 ~ login ~ ExistedUser:", ExistedUser);

    if (!ExistedUser) {
      return res
        .status(401)
        .json({ message: "InCorrect Email Or Password", success: false });
    }

    const isPasswordValid = await ExistedUser.isPasswordCorrect(password);
    console.log("🚀 ~ login ~ isPasswordValid:", isPasswordValid);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "InCorrect Password", success: false });
    }

    const Generate_AccessToken = await ExistedUser.generateAccessToken();
    console.log("🚀 ~ login ~ Generate_AccessToken:", Generate_AccessToken);

    if (!Generate_AccessToken) {
      return res.status(401).json({ message: "Token problem", success: false });
    }

    res.cookie("AccessToken", Generate_AccessToken, {
      ...options,
      maxAge: 24 * 60 * 60 * 1000,
    });
    console.log("🚀 ~ login ~ res.cookie:", req.cookies);

    await ExistedUser.populate({
      path: "posts",
      $sort: { createdAt: -1 },
      populate: [
        { path: "author", select: "username profilePicture" },
        {
          path: "comments",
          $sort: { createdAt: -1 },
          populate: { path: "author", select: "username profilePicture" },
        },
      ],
    });

    res.status(201).json({
      msg: "User Login successfully",
      success: true,
      ExistedUser,
    });
  } catch (error) {
    console.log(error);
  }
};

const logout = async (req, res) => {
  //it need to if i loggog in or not

  //   const AccessTokencookie = req.cookies.AccessToken;
  //   console.log("🚀 ~ logout ~ req:", req);
  //   console.log("🚀 ~ logout ~ AccessTokencookie:", AccessTokencookie);

  //   if (!AccessTokencookie) {
  //     res.status(401).json({
  //       msg: "User Token Absent",
  //       status: 401,
  //     });
  //   }

  //   const TokenVerify = jwt.verify(
  //     AccessTokencookie,
  //     process.env.ACCESS_TOKEN_SECRET
  //   );
  //   console.log("🚀 ~ logout ~ TokenVerify:", TokenVerify);

  //   res.clearCookie("AccessToken", { ...options });

  res
    .status(200)
    .clearCookie("AccessToken", { ...options, maxAge: 0 })
    .json({
      message: "User Logout ",
      status: 200,
      success: true,
    });
};

const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  console.log("🚀 ~ updatePassword ~ newPassword:", newPassword);
  console.log("🚀 ~ updatePassword ~ oldPassword:", oldPassword);
  const user = req.logged_in_user;

  const temp_check_for_user = await User.findById(user._id);

  const Is_old_password_correct = await temp_check_for_user.isPasswordCorrect(
    oldPassword
  );
  console.log(
    "🚀 ~ updatePassword ~ is_old_password_correct:",
    Is_old_password_correct
  );

  if (!Is_old_password_correct) {
    res.status(401).json({
      msg: "Password is not Correct",
      status: 401,
    });
  }
  temp_check_for_user.password = newPassword;
  console.log(
    "🚀 ~ updatePassword ~ Is_old_password_correct:",
    Is_old_password_correct
  );
  const u = await temp_check_for_user.save();
  console.log("🚀 ~ updatePassword ~ u:", u);

  res.status(200).json({
    msg: "Password Updated",
    status: 200,
  });
};

const getProfile = async (req, res) => {
  const userID = req.params.id;
  console.log("🚀 ~ getProfile ~ userID:", userID);

  const user = await User.findById(userID).select("-password");
  console.log("🚀 ~ getProfile ~ user:", user);

  res.status(200).json({
    msg: "User  Profile",
    status: 200,
    user,
  });
};

const editProfile = async (req, res) => {
  try {
    // const temp_id = req.params.id;

    const user = req.logged_in_user;

    // if (temp_id != user._id) {
    //   res.status(401).json({
    //     msg: "not your account",
    //     status: 401,
    //   });
    // }

    const { bio, gender } = req.body;
    console.log("🚀 ~ editProfile ~ bio, gender:", bio, gender);

    const profileImage = req.file;
    console.log("🚀 ~ editProfile ~ profileImage:", profileImage);

    // user.bio = bio;
    // user.gender = gender;

    const profileImageCloudinaryURL = await uploadOnCloudinary(
      profileImage?.path
    );
    console.log(
      "🚀 ~ editProfile ~ profileImageCloudinaryURL:",
      profileImageCloudinaryURL
    );

    if (user.profilePicture || user.profilePicture !== "") {
      const deletePreviosImage = await deleteFromCloudinary(user.profileImage);
      // console.log("🚀 ~ editProfile ~ deletePreviosImage:", deletePreviosImage);
    }

    const newuser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          bio,
          gender,
          profilePicture: profileImageCloudinaryURL?.url,
        },
      },
      {
        new: true,
      }
    );
    console.log("🚀 ~ editProfile ~ newuser:", newuser);

    res.status(200).json({
      msg: "Profile Updated",
      newuser,
    });
  } catch (error) {
    console.log(error);
  }
};

const getSuggestedUsers = async (req, res) => {
  const user = req.logged_in_user;

  const SuggestedUser = await User.find({ _id: { $ne: user._id } });
  console.log("🚀 ~ getSuggestedUsers ~ SuggestedUser:", SuggestedUser);

  if (!SuggestedUser) {
    res.status(400).json({
      msg: "not any suggested User",
      status: 400,
    });
  }

  res.status(200).json({
    msg: "suggested User",
    status: 200,
    SuggestedUser,
  });
};

const followandunfollow = async (req, res) => {
  //follow krne wala -- > logged_in_user
  const user = req.logged_in_user;

  //jisko follow karuga
  const another_user_id = req.params.id;
  console.log("🚀 ~ followandunfollow ~ another_user_id:", another_user_id);

  if (user == another_user_id) {
    res.status(400).json({
      msg: "follw not possible",
      status: 400,
    });
  }

  // User.findById(user._id).findOne({followers : {$e}})
  const currentUser = await User.findById(user._id);
  const tragetUser = await User.findById(another_user_id);

  if (!tragetUser) {
    res.status(400).json({
      msg: "profile not found ",
      status: 400,
    });
  }

  const isFollowing = currentUser.following.includes(tragetUser._id);
  console.log("🚀 ~ followandunfollow ~ isFollowing:", isFollowing);

  if (isFollowing) {
    //current user want to unfollow ---- already following --> so unfollow
    //logged in user -> following remove;
    // target user -> follower remove;

    const current_user_updated_following = await User.updateOne(
      { _id: currentUser._id },
      {
        $pull: {
          following: tragetUser._id,
        },
      },
      {
        new: true,
      }
    );
    console.log(
      "🚀 ~ followandunfollow ~ current_user_updated_following:",
      current_user_updated_following
    );

    const target_user_updated_follower = await User.updateOne(
      { _id: tragetUser._id },
      {
        $pull: {
          followers: currentUser._id,
        },
      },
      {
        new: true,
      }
    );
    console.log(
      "🚀 ~ followandunfollow ~ target_user_updated_follower:",
      target_user_updated_follower
    );

    res.status(200).json({
      msg: `you unfollow ${tragetUser.username} `,
      status: 200,
    });
  } else {
    // current user want to follow ---- currently not following ---> so follow

    const current_user_updated_following = await User.updateOne(
      { _id: currentUser._id },
      {
        $push: {
          following: tragetUser._id,
        },
      },
      {
        new: true,
      }
    );
    console.log(
      "🚀 ~ followandunfollow ~ current_user_updated_following:",
      current_user_updated_following
    );

    const target_user_updated_follower = await User.updateOne(
      { _id: tragetUser._id },
      {
        $push: {
          followers: currentUser._id,
        },
      },
      {
        new: true,
      }
    );
    console.log(
      "🚀 ~ followandunfollow ~ target_user_updated_follower:",
      target_user_updated_follower
    );

    res.status(200).json({
      msg: `you follow ${tragetUser.username} `,
      status: 200,
    });
  }
};

export {
  login,
  logout,
  register,
  updatePassword,
  editProfile,
  getProfile,
  followandunfollow,
  getSuggestedUsers,
};
