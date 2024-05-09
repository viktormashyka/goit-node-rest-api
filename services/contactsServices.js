import Contact from "../models/Contact.js";

export const listContacts = (search = {}) => {
  const { filter = {} } = search;
  return Contact.find(filter);
};

export const getContactById = (_id) => Contact.findById(_id);

export const removeContact = (_id) => Contact.findByIdAndDelete(_id);

export const addContact = (data) => Contact.create(data);

export const updateContactById = (_id, data) =>
  Contact.findByIdAndUpdate(_id, data);
