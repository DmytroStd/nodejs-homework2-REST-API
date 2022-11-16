const { Contacts } = require("./schemas/contacts");

const getAllContacts = async (req, res) => {
  return Contacts.find({});
};

const getContactById = (id) => {
  return Contacts.findOne({ _id: id });
};

const createContact = ({ name, email, phone, favorite }) => {
  return Contacts.create({ name, email, phone, favorite });
};

const updateContact = (id, fields) => {
  return Contacts.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

const updateStatusContact = (id, body) => {
  return Contacts.findByIdAndUpdate({ _id: id }, body, { new: true });
};

const removeContact = (id) => {
  return Contacts.findByIdAndRemove({ _id: id });
};

module.exports = {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  updateStatusContact,
  removeContact,
};
