import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    console.log("🚀 ~ returnnewPromise ~ fileReader:", fileReader);
    fileReader.onloadend = () => {
      if (typeof fileReader.result === "string") {
        console.log(
          "🚀 ~ returnnewPromise ~ fileReader.result:",
          fileReader.result
        );
        resolve(fileReader.result);
      }
    };
    fileReader.readAsDataURL(file);
  });
};
