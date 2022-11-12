const fs = require("fs/promises");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// import fs from "fs/promises";
// import { fileURLToPath } from "url";
// import path, { dirname } from "path";

// const contactsPath = dirname(fileURLToPath("file:///contacts.json"));

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath, "utf-8");

    return JSON.parse(contacts);
  } catch (error) {
    throw error;
  }
};

const updateContactsFile = async (contacts) =>
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  return contacts.find((elem) => elem.id === contactId);
};

const removeContact = async (contactId) => {
  let contacts = await listContacts();
  const removedContact = contacts.filter((el) => el.id !== contactId);
  contacts = [...removedContact];
  return removedContact;
};

const addContact = async (body) => {
  const { name, email, phone } = body;
  const contacts = await listContacts();
  const newContact = {
    id: uuidv4(),
    name,
    email,
    phone,
  };

  contacts.push(newContact);
  await updateContactsFile(contacts);
  return newContact;
};

const updateContact = async (contactId, body) => {
  const { name, email, phone } = body;
  const contacts = await listContacts();
  const contactToChange = contacts.find((elem) => elem.id === contactId);

  if (!contactToChange) {
    return null;
  }

  contactToChange.name = name;
  contactToChange.email = email;
  contactToChange.phone = phone;

  await updateContactsFile(contacts);
  return contactToChange;
};
// export { listContacts };
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
