const express = require("express");
const {
  registration,
  login,
  logout,
  current,
  updateSubscription,
  updateAvatar,
  verifyUser,
  verificationRetry,
} = require("../../controller/users");
const auth = require("../../service/middlewares/authMiddleware");
const ctrlWrapper = require("../../service/helpers/ctrlWrapper");
const upload = require("../../service/middlewares/multer");
require("dotenv").config();

const router = express.Router();

router.post("/signup", registration);

router.post("/login", ctrlWrapper(login));

router.get("/logout", auth, ctrlWrapper(logout));

router.get("/current", auth, ctrlWrapper(current));

router.patch("/", auth, updateSubscription);

router.patch("/avatars", auth, upload.single("avatar"), updateAvatar);

router.get("/verify/:verificationToken", ctrlWrapper(verifyUser));

router.post("/verify", ctrlWrapper(verificationRetry));

module.exports = router;
