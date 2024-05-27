import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import * as authServices from "../services/authServices.js";
import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from "../decorators/ctrlWrapper.js";
import { compareHash } from "../helpers/compareHash.js";
import { createToken } from "../helpers/jwt.js";
import { sendEmail } from "../helpers/sendEmail.js";
import { nanoid } from "nanoid";

const avatarPath = path.resolve("public", "avatars");

const signup = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const verificationToken = nanoid();

  const newUser = await authServices.saveUser({
    ...req.body,
    avatarURL: gravatar.url(email, { s: "100", r: "x", d: "retro" }, true),
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: newUser.subscription,
    },
  });
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await authServices.findUser({ verificationToken });

  if (!user) {
    throw HttpError(401, "User not found or email already verified");
  }
  await authServices.updateUser(
    { _id: user.id },
    { verify: true, verificationToken: null }
  );

  res.json({ message: "Verification successful" });
};

const resendVerify = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(404, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="http://localhost:3000/api/users/verify/${user.verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({ message: "Verification email sent" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.findUser({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verify");
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
  await fs.rename(oldPath, newPath);

  const avatar = path.join("avatars", filename);

  await authServices.updateUser({ _id }, { avatarURL: avatar });

  res.status(200).json({ avatarURL: avatar });
};

export default {
  signup: ctrlWrapper(signup),
  verify: ctrlWrapper(verify),
  resendVerify: ctrlWrapper(resendVerify),
  getCurrent: ctrlWrapper(getCurrent),
  login: ctrlWrapper(login),
  logout: ctrlWrapper(logout),
  subscribe: ctrlWrapper(subscribe),
  addAvatar: ctrlWrapper(addAvatar),
};
