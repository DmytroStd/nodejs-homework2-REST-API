const { Contacts } = require("./schemas/contacts");
const { User } = require("./schemas/users");

const getAllContacts = async (id) => {
  return Contacts.find({ owner: id });
};

const getByPage = async (page = 1, perPage = 5, id) => {
  return Contacts.find({ owner: id })
    .skip((page - 1) * perPage)
    .limit(perPage);
};

const getFavorite = async (owner, favorite) => {
  return Contacts.find({ favorite, owner });
};

const getTotalContacts = async (id) => {
  return Contacts.find({ owner: id }).count();
};

const getContactById = (id) => {
  return Contacts.findOne({ _id: id });
};

const createContact = ({ name, email, phone, favorite, owner }) => {
  return Contacts.create({ name, email, phone, favorite, owner });
};

const updateContact = (id, fields) => {
  return Contacts.findByIdAndUpdate({ _id: id }, fields, { new: true });
};

const updateStatusContact = (id, body) => {
  return Contacts.findByIdAndUpdate({ _id: id }, body, { new: true });
};

const updateUserSubscription = (id, subscription) => {
  return User.findByIdAndUpdate({ _id: id }, subscription);
};

const updateUserAvatar = (id, avatarURL) => {
  return User.findByIdAndUpdate({ _id: id }, avatarURL);
};

const removeContact = (id) => {
  return Contacts.findByIdAndRemove({ _id: id });
};

module.exports = {
  getAllContacts,
  getByPage,
  getTotalContacts,
  getFavorite,
  getContactById,
  createContact,
  updateContact,
  updateStatusContact,
  updateUserSubscription,
  updateUserAvatar,
  removeContact,
};
