import express from "express";
import authControllers from "../controllers/authControllers.js";
import { isEmptyBody } from "../middlewares/isEmptyBody.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/upload.js";
import { validateBody } from "../decorators/validateBody.js";

import {
  authLoginSchema,
  authSignupSchema,
  userSubscriptionSchema,
  authEmailSchema,
} from "../schemas/authSchema.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  isEmptyBody,
  validateBody(authSignupSchema),
  authControllers.signup
);

authRouter.get("/verify/:verificationToken", authControllers.verify);

authRouter.post(
  "/verify",
  isEmptyBody,
  validateBody(authEmailSchema),
  authControllers.resendVerify
);

authRouter.post(
  "/login",
  isEmptyBody,
  validateBody(authLoginSchema),
  authControllers.login
);

authRouter.get("/current", authenticate, authControllers.getCurrent);

authRouter.post("/logout", authenticate, authControllers.logout);

authRouter.patch(
  "/",
  authenticate,
  isEmptyBody,
  validateBody(userSubscriptionSchema),
  authControllers.subscribe
);

authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatarURL"),
  authControllers.addAvatar
);

export default authRouter;
