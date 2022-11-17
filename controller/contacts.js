const service = require("../service/index");
const {
  contactSchema,
  updateFavoriteSchema,
} = require("../service/schemas/contacts");

const get = async (req, res, next) => {
  try {
    const contacts = await service.getAllContacts();
    res.json({
      status: "success",
      code: 200,
      data: { contacts },
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const contact = await service.getContactById(req.params.id);
    if (!contact) {
      res.json({
        status: "success",
        code: 404,
        message: "Not found",
      });
    } else {
      res.json({
        status: "success",
        code: 200,
        data: { contact },
      });
    }
  } catch (err) {
    console.error(err);
    next(err);
  }
};

const addContact = async (req, res, next) => {
  try {
    const validationResult = contactSchema.validate(req.body);
    if (validationResult.error) {
      return res.json({
        status: validationResult.error.details[0].message,
        code: 400,
        message: "missing required name field",
      });
    }
    const contact = await service.createContact(req.body);

    res.json({
      status: "success",
      code: 201,
      data: { contact },
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const validationResult = contactSchema.validate(req.body);
    if (validationResult.error) {
      return res.json({
        status: validationResult.error.details[0].message,
        code: 400,
        message: "missing fields",
      });
    }
    const contacts = await service.updateContact(req.params.id, req.body);
    if (!contacts) {
      res.json({
        status: "success",
        code: 404,
        message: "Not found",
      });
    } else {
      res.json({
        status: "success",
        code: 200,
        data: { contacts },
      });
    }
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  const { id } = req.params;
  const { isDone = false } = req.body;

  try {
    const validationResult = updateFavoriteSchema.validate(req.body);
    if (validationResult.error) {
      return res.json({
        status: validationResult.error.details[0].message,
        code: 400,
        message: "missing field favorite",
      });
    }
    const contacts = await service.updateStatusContact(id, { isDone });
    if (!contacts) {
      res.json({
        status: "success",
        code: 404,
        message: "Not found",
      });
    } else {
      res.json({
        status: "success",
        code: 200,
        data: { contacts },
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    const contact = await service.removeContact(req.params.id);
    if (!contact) {
      res.json({
        status: "Not found",
        code: 404,
        message: "Not found",
      });
    } else {
      res.json({
        status: "success",
        code: 200,
        message: "contact deleted",
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  get,
  getById,
  addContact,
  update,
  updateStatus,
  remove,
};
