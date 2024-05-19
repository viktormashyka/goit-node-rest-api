import express from "express";
import contactsControllers from "../controllers/contactsControllers.js";
import { isEmptyBody } from "../middlewares/isEmptyBody.js";
import { validateBody } from "../decorators/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";

import {
  createContactSchema,
  updateContactSchema,
  updateStatusSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsControllers.getAll);

contactsRouter.get("/:id", isValidId, contactsControllers.getById);

contactsRouter.delete("/:id", isValidId, contactsControllers.deleteById);

contactsRouter.post(
  "/",
  isEmptyBody,
  validateBody(createContactSchema),
  contactsControllers.add
);

contactsRouter.put(
  "/:id",
  isValidId,
  isEmptyBody,
  validateBody(updateContactSchema),
  contactsControllers.updateById
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  isEmptyBody,
  validateBody(updateStatusSchema),
  contactsControllers.getById
);

export default contactsRouter;
