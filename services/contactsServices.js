import Contact from "../models/Contact.js";

export const listContacts = (search = {}) => {
  const { filter = {}, fields = "", settings = {} } = search;
  return Contact.find(filter, fields, settings).populate("owner", "email");
};

export const countContacts = (filter) => Contact.countDocuments(filter);

export const getContact = (filter) => Contact.findOne(filter);

export const addContact = (data) => Contact.create(data);

export const updateContact = (filter, data) =>
  Contact.findOneAndUpdate(filter, data);

export const removeContact = (filter) => Contact.findOneAndDelete(filter);
