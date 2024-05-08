import {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContactById,
} from "../services/contactsServices.js";

import { HttpError } from "../helpers/HttpError.js";
import { ctrlWrapper } from "../decorators/ctrlWrapper.js";

const getAllContacts = async (req, res) => {
  const contacts = await listContacts();
  res.json(contacts);
};

const getOneContact = async (req, res) => {
  const { id } = req.params;
  const contact = await getContactById(id);

  if (!contact) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }
  res.json(contact);
};

const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await removeContact(id);

  if (!result) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.json({
    data: result,
    message: "Delete success",
  });
};

const createContact = async (req, res) => {
  const newContact = await addContact(req.body);
  res.status(201).json(newContact);
};

const updateContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await updateContactById(id, req.body);

  if (!contact) {
    throw HttpError(404, `Contact with id=${id} not found`);
  }

  res.status(200).json(contact);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  createContact: ctrlWrapper(createContact),
  deleteContact: ctrlWrapper(deleteContact),
  updateContact: ctrlWrapper(updateContact),
};
