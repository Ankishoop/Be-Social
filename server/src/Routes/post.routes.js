import { Router } from "express";
import {
  addcomment,
  addPost,
  bookmarkpost,
  deletePost,
  getAllcommentsofpost,
  getAllpost,
  getuserpost,
  likeandunlike,
} from "../Controllers/post.controller.js";
import { verifyJWT } from "../Middlewares/auth.js";
// import { uploadbuffer } from "../Middlewares/multer.js";
import { upload } from "../Middlewares/multer.js";

const router = Router();

router.route("/addpost").post(verifyJWT, upload.single("postImage"), addPost);
router.route("/deletepost/:postId").delete(verifyJWT, deletePost); // in params id should be given

router.route("/updatelike/:postId").patch(verifyJWT, likeandunlike);

router.route("/allposts").get(verifyJWT, getAllpost);
router.route("/userpost").get(verifyJWT, getuserpost);
router.route("/comment/:postId").post(verifyJWT, addcomment);

router.route("/allcommentsofpost/:postId").get(verifyJWT, getAllcommentsofpost);

router.route("/bookmark/:postId").patch(verifyJWT, bookmarkpost);
export default router;
