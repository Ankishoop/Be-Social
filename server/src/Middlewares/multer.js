// import multer from "multer";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/temp");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });

// export const upload = multer({
//   storage,
// });

// const storageForBuffer = multer.memoryStorage();

// export const uploadbuffer = multer({
//   storage: storageForBuffer,
// });

import multer from "multer";
const upload = multer({
  storage: multer.memoryStorage(),
});
export default upload;
