import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

const updateContacts = (contacts) =>
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

async function listContacts() {
  const data = await fs.readFile(contactsPath, "utf-8");

  return JSON.parse(data);
}

async function getContactById(id) {
  const contacts = await listContacts();
  const result = contacts.find((item) => item.id === id);

  return result || null;
}

async function removeContact(id) {
  const contacts = await listContacts();
  const index = contacts.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await updateContacts(contacts);

  return result;
}

async function addContact(data) {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    ...data,
  };
  contacts.push(newContact);
  await updateContacts(contacts);

  return newContact;
}

async function updateContactById(id, data) {
  const contacts = await listContacts();

  const index = contacts.findIndex((item) => item.id === id);
  if (index === -1) {
    return null;
  }
  contacts[index] = { ...contacts[index], ...data };
  await updateContacts(contacts);

  return contacts[index];
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById,
};
