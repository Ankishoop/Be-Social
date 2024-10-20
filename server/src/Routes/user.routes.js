import { Router } from "express";
import {
  login,
  register,
  logout,
  updatePassword,
  editProfile,
  getProfile,
  followandunfollow,
  getSuggestedUsers,
} from "../Controllers/user.controller.js";
import { verifyJWT } from "../Middlewares/auth.js";
import { upload } from "../Middlewares/multer.js";

const router = Router();

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/logout").get(verifyJWT, logout);
router.route("/updatepassword").post(verifyJWT, updatePassword);
router
  .route("/editprofile")
  .patch(verifyJWT, upload.single("ProfilePicture"), editProfile);

router
  .route("/profile/:id")
  .get(verifyJWT, getProfile)
  .patch(verifyJWT, followandunfollow);

router.route("/suggesteduser").get(verifyJWT, getSuggestedUsers);

//in video the Routes are like that
// router.route("/login").post(login);
// router.route("/register").post(register);
// router.route("/logout").get(verifyJWT, logout);
// router.route("/followunfollow/:id").patch(verifyJWT, followandunfollow);
// router
//   .route("/profile/edit")
//   .patch(verifyJWT, upload.single("ProfilePicture"), editProfile);

// router.route("/:id/profile").get(verifyJWT, getProfile);

export default router;
