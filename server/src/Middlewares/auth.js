import jwt from "jsonwebtoken";
import { User } from "../Models/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const AccessTokencookie = req.cookies.AccessToken;
    console.log("🚀 ~ AccessTokencookie:", AccessTokencookie);

    if (!AccessTokencookie) {
      res.status(401).json({
        msg: "User Token Absent",
        status: 401,
      });
    }

    const TokenVerify = jwt.verify(
      AccessTokencookie,
      process.env.ACCESS_TOKEN_SECRET
    );
    console.log("🚀 ~ TokenVerify:", TokenVerify);

    const ExistedUser = await User.findById(TokenVerify._id).select(
      "-password"
    );
    console.log("🚀 ~ verifyJWT ~ ExistedUser:", ExistedUser);

    req.logged_in_user = ExistedUser;
    next();
  } catch (error) {
    console.log(error);
  }
};
