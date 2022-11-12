// import express from "express";
// import { listContacts } from "../../models/contacts.js";
const express = require("express");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");
const {contactSchema} = require("../../schemas/contacts");
// const { v4: uuidv4 } = require("uuid");

const router = express.Router();

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  res.json({
    status: "success",
    code: 200,
    data: { contacts },
  });
});

router.get("/:id", async (req, res, next) => {
  const contact = await getContactById(req.params.id);
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
});

router.post("/", async (req, res, next) => {
  try {
    const validationResult = contactSchema.validate(req.body);
    if (validationResult.error) {
      return res.json({
        status: validationResult.error.details[0].message,
        code: 400,
        message: "missing required name field",
      });
    }
    const contact = await addContact(req.body);

    res.json({
      status: "success",
      code: 201,
      data: { contact },
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  const contact = await removeContact(req.params.id);
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
});

router.put("/:id", async (req, res, next) => {
  try {
    const validationResult = contactSchema.validate(req.body);
    if (validationResult.error) {
      return res.json({
        status: validationResult.error.details[0].message,
        code: 400,
        message: "missing fields",
      });
    }
    const contacts = await updateContact(req.params.id, req.body);
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
});
// export default router;
module.exports = router;
