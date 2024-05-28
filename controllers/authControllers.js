import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";
import * as authServices from "../services/authServices.js";
import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from "../decorators/ctrlWrapper.js";
import { compareHash } from "../helpers/compareHash.js";
import { createToken } from "../helpers/jwt.js";

const avatarPath = path.resolve("public", "avatars");

const signup = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const newUser = await authServices.saveUser({
    ...req.body,
    avatarURL: gravatar.url(email, { s: "100", r: "x", d: "retro" }, true),
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }
  const comparePassword = await compareHash(password, user.password);

  if (!comparePassword) {
    throw HttpError(401, "Email or password is wrong");
  }

  const { _id: id } = user;
  const payload = { id };

  const token = createToken(payload);
  await authServices.updateUser({ _id: id }, { token });

  res.json({
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  });
};

const getCurrent = (req, res) => {
  const { email, subscription } = req.user;

  res.json({ email, subscription });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await authServices.updateUser({ _id }, { token: "" });

  res.status(204).json({ message: "No Content" });
};

const subscribe = async (req, res) => {
  const { _id, email } = req.user;
  const { subscription } = req.body;

  await authServices.updateUser({ _id }, { subscription });

  res.status(200).json({ email, subscription });
};

const addAvatar = async (req, res) => {
  const { _id } = req.user;

  if (!req.file) {
    throw Error("File not added. Please add file with avatar.");
  }

  const { path: oldPath, filename } = req.file;
  const newPath = path.join(avatarPath, filename);

  Jimp.read(oldPath, (err, avatar) => {
    if (err) throw err;
    avatar
      .resize(256, 256) // resize
      .quality(60) // set JPEG quality
      .greyscale() // set greyscale
      .write(oldPath); // save
  });

  await fs.rename(oldPath, newPath);

  const avatarURL = path.join("avatars", filename);

  await authServices.updateUser({ _id }, { avatarURL });

  res.status(200).json({ avatarURL });
};

export default {
  signup: ctrlWrapper(signup),
  getCurrent: ctrlWrapper(getCurrent),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  subscribe: ctrlWrapper(subscribe),
  addAvatar: ctrlWrapper(addAvatar),
};
