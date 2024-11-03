// import { v2 as cloudinary } from "cloudinary";
// import fs from "fs";
// import dotenv from "dotenv";
// dotenv.config({});

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_SECRET,
//   secure: true,
// });

// // cloudinary.config({
// //   cloud_name: "dgxco6pjj",
// //   api_key: "795387153126224",
// //   api_secret: "4NpW1l0JIJ512gp_-gVYG0dlF5Q",
// //   secure: true,
// // });

// const uploadOnCloudinary = async (ServerLocalPath) => {
//   try {
//     // console.log("🚀 ~ uploadOnCloudinary ~ ServerLocalPath:", ServerLocalPath);

//     // console.log(
//     //   "🚀 ~ uploadOnCloudinary ~ typeof(ServerLocalPath):",
//     //   typeof ServerLocalPath
//     // );
//     // console.log(
//     //   "🚀 ~ uploadOnCloudinary ~ process.env.CLOUDINARY_NAME:",
//     //   process.env.CLOUDINARY_NAME
//     // );
//     // console.log(
//     //   "🚀 ~ uploadOnCloudinary ~ process.env.CLOUDINARY_NAME:",
//     //   process.env.CLOUDINARY_API_KEY
//     // );
//     // console.log(
//     //   "🚀 ~ uploadOnCloudinary ~ process.env.CLOUDINARY_NAME:",
//     //   process.env.CLOUDINARY_SECRET
//     // );
//     if (!ServerLocalPath) {
//       return null;
//     }

//     console.log("GG");
//     const response = await cloudinary.uploader.upload(ServerLocalPath, {
//       resource_type: "auto",
//     });
//     // const response = await cloudinary.uploader.upload(ServerLocalPath);

//     console.log("file is uploaded on Cloudinary");
//     // console.log("🚀 ~ uploadOnCloudinary ~ response:", response);

//     fs.unlinkSync(ServerLocalPath);

//     return response;
//   } catch (error) {
//     // console.log("🚀 ~ uploadOnCloudinary ~ error:", error);
//     // console.log("HH");
//     fs.unlinkSync(ServerLocalPath);

//     return null;
//   }
// };

// const deleteFromCloudinary = async (url) => {
//   try {
//     const public_id = extractPublicId(url);
//     const response = await cloudinary.uploader.destroy(public_id);
//     console.log("🚀 ~ deleteFromCloudinary ~ response:", response);

//     return response;
//   } catch (error) {
//     console.log(error);
//   }
// };

// const extractPublicId = (url) => {
//   // Match the part of the URL after 'upload/' and before the file extension
//   const regex = /\/upload\/(?:v\d+\/)?([^\.]+)\./;
//   const match = url.match(regex);
//   return match ? match[1] : null;
// };

// export { uploadOnCloudinary, deleteFromCloudinary };

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config({});

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

// cloudinary.config({
//   cloud_name: "dgxco6pjj",
//   api_key: "795387153126224",
//   api_secret: "4NpW1l0JIJ512gp_-gVYG0dlF5Q",
//   secure: true,
// });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});
export default cloudinary;
