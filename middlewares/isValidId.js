import { isValidObjectId } from "mongoose";

import { HttpError } from "../helpers/HttpError";

export const isValidId = (req, res, next) => {
  const { id } = req.param;
  if (!isValidObjectId(id)) {
    return next(HttpError(404, `${id} not valid id`));
  }
  next();
};
