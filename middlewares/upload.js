import multer from "multer";
import path from "path";

import { HttpError } from "../helpers/HttpError.js";

const destination = path.resolve("temp");

const storage = multer.diskStorage({
  destination,
  filename: (req, file, callback) => {
    const uniquePrefix = `${Date.now()}_${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniquePrefix}_${file.originalname}`;
    callback(null, filename);
  },
});

const limits = { fileSize: 1024 * 1024 * 5 };

const fileFilter = (req, file, callback) => {
  const extension = file.originalname.split(".").pop();

  if (extension === "exe") {
    return callback(HttpError(400, ".exe extension not allow "));
  }

  callback(null, true);
};

export const upload = multer({ storage, limits, fileFilter });
