import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    bookmarks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  console.log("in pre save");
  if (!this.isModified("password")) {
    return next();
  }
  console.log("🚀 ~ userSchema.pre ~ this:", this);
  console.log("🚀 ~ userSchema.pre ~ this.password:", this.password);

  console.log("password is modified");
  this.password = await bcrypt.hash(this.password, 10);
  console.log("🚀 ~ userSchema.pre ~ this.password :", this);

  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  console.log(process.env.ACCESS_TOKEN_EXPIRY);
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,

    {
      expiresIn: `${process.env.ACCESS_TOKEN_EXPIRY}`,
    }
  );
};

// userSchema.methods.isValidToken = async function() {
//   jwt.
// }
export const User = mongoose.model("User", userSchema);
