import * as contactsServices from "../services/contactsServices.js";

import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from "../decorators/ctrlWrapper.js";

const getAll = async (req, res) => {
  const { _id: owner } = req.user;

  const filter = { owner };
  const fields = "-createdAt -updatedAt";
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const settings = { skip, limit };
  const result = await contactsServices.listContacts({
    filter,
    fields,
    settings,
  });
  const total = await contactsServices.countContacts(filter);

  res.json({
    total,
    result,
  });
};

const getById = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsServices.getContact({ _id, owner });

  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }
  res.json(result);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await contactsServices.addContact({ ...req.body, owner });
  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsServices.updateContact({ _id, owner }, req.body);
  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.status(200).json(result);
};

const deleteById = async (req, res) => {
  const { id: _id } = req.params;
  const { _id: owner } = req.user;
  const result = await contactsServices.removeContact({ _id, owner });

  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json(result);
};

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  deleteById: ctrlWrapper(deleteById),
  updateById: ctrlWrapper(updateById),
};
