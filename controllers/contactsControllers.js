import contactsService from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

import { HttpError } from "../helpers/HttpError.js";

const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactsService.listContacts(); //throw new Error()
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await contactsService.getContactById(id);

    if (!contact) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await contactsService.removeContact(id);

    if (!result) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }

    res.json({
      message: "Delete success",
    });
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const newContact = await contactsService.addContact(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error } = updateContactSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    const contact = await contactsService.updateContactById(id, req.body);

    if (!contact) {
      throw HttpError(404, `Contact with id=${id} not found`);
    }

    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export default {
  getAllContacts,
  getOneContact,
  createContact,
  deleteContact,
  updateContact,
};
