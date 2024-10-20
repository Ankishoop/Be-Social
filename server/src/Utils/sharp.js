import sharp from "sharp";

const highDtolowD = async (image, height, width, resizeoption) => {
  console.log("🚀 ~ highDtolowD ~ resizeoption:", resizeoption);
  console.log("🚀 ~ highDtolowD ~ image.buffer:", image.buffer);
  try {
    return await sharp(image.buffer)
      .resize({
        width: width,
        height: height,
        resize: resizeoption,
      })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();
  } catch (error) {
    console.log(error);
  }
};

export { highDtolowD };
