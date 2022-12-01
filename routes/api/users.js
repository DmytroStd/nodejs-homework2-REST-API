const express = require("express");
const {
  registration,
  login,
  logout,
  current,
  updateSubscription,
} = require("../../controller/users");
const auth = require("../../service/middlewares/authMiddleware");
const ctrlWrapper = require("../../service/helpers/ctrlWrapper");
require("dotenv").config();

const router = express.Router();

router.post("/signup", ctrlWrapper(registration));
router.post("/login", ctrlWrapper(login));
router.get("/logout", auth, ctrlWrapper(logout));
router.get("/current", auth, ctrlWrapper(current));
router.patch("/", auth, ctrlWrapper(updateSubscription));

module.exports = router;
