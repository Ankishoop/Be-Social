import dotenv from "dotenv";
import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./src/utils/db.js";
import { app, server } from "./src/Socket/socket.js";
import path from "path";
dotenv.config();

// console.log("🚀 ~ process.env.PORT:", process.env.PORT);
// const app = express();

const __dirname = path.resolve();
console.log("🚀 ~ __dirname:", __dirname);

//middlewares
const PORT = process.env.PORT || 8000;
console.log("🚀 ~ PORT:", PORT);
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
});

const corsOption = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOption));

// app.get("/", (req, res) => {
//   res.status(200).json({
//     status: 200,
//     msg: "server running",
//   });
// });

const DatabaseConnection = async () => {
  await connectDB()
    .then(() => {
      server.listen(PORT, () => {
        console.log(`server listen at port ${PORT}`);
      });
    })
    .catch((err) => {
      throw err;
    });
};

DatabaseConnection();

// app.listen(PORT, () => {
//   connectDB();
//   console.log(`server listen at port ${PORT}`);
// });
import UserRouter from "./src/Routes/user.routes.js";
import PostRouter from "./src/Routes/post.routes.js";
import MessageRouter from "./src/Routes/message.route.js";

app.use("/api/v1/user", UserRouter);
app.use("/api/v1/post", PostRouter);
app.use("/api/v1/message", MessageRouter);
