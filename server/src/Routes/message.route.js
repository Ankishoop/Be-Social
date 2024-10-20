import { Router } from "express";
import { verifyJWT } from "../Middlewares/auth.js";
import { getMessage, sendmessage } from "../Controllers/message.controller.js";

const router = Router();

router.route("/send/:receiverId").post(verifyJWT, sendmessage);
router.route("/get/:receiverId").get(verifyJWT, getMessage);

export default router;
