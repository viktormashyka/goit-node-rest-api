import contactsService from "../services/contactsServices.js";
import {
  createContactSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

export const getAllContacts = async (req, res) => {
  const contacts = await contactsService.listContacts();

  res.json({
    status: "success",
    code: 200,
    data: contacts,
  });
};

export const getOneContact = async (req, res, next) => {
  const { id } = req.params;
  const contact = await contactsService.getContactById(id);

  if (!contact) {
    res.status(404).json({
      status: "not found",
      code: 404,
      message: "Not found",
    });
    return;
  }

  res.json({
    status: "success",
    code: 200,
    data: contact,
  });
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await contactsService.removeContact(id);

  if (!result) {
    res.status(404).json({
      status: "not found",
      code: 404,
      message: "Not found",
    });
    return;
  }

  res.json({
    status: "success",
    code: 200,
    data: result,
  });
};

export const createContact = async (req, res) => {
  const { name, email, phone } = req.body;

  const { error } = createContactSchema.validate({
    name,
    email,
    phone,
  });

  if (error) {
    res.status(400).json({
      status: "Bad request",
      code: 400,
      message: error,
    });
    return;
  }

  const newContact = await contactsService.addContact(name, email, phone);

  res.json({
    status: "success",
    code: 201,
    data: newContact,
  });
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  const { error } = updateContactSchema.validate({
    name,
    email,
    phone,
  });

  if (error) {
    res.status(400).json({
      status: "Bad request",
      code: 400,
      message: error,
    });
    return;
  }

  const contact = await contactsService.updateContactById(id, {
    name,
    email,
    phone,
  });

  if (!contact) {
    res.status(404).json({
      status: "not found",
      code: 404,
      message: "Not found",
    });
  }

  res.json({
    status: "success",
    code: 200,
    data: contact,
  });
};
