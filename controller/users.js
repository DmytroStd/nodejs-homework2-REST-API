const path = require("path");
const fs = require("fs").promises;
const jwt = require("jsonwebtoken");
const { User, userSchema } = require("../service/schemas/users");
require("dotenv").config();
const secret = process.env.SECRET;
const service = require("../service/index");
const gravatar = require("gravatar");
const Jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");
const sendVerificationMail = require("../service/helpers/sendVerificationMail");

const registration = async (req, res, next) => {
  const validationResult = userSchema.validate(req.body);
  if (validationResult.error) {
    return res.json({
      status: validationResult.error.details[0].message,
      code: 401,
      message: "Email or password is wrong",
    });
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    return res.status(409).json({
      status: "error",
      code: 409,
      message: "Email in use",
      data: "Conflict",
    });
  }
  const avatarURL = gravatar.url(email);
  const verificationToken = uuidv4();
  try {
    const newUser = new User({ email, password, avatarURL });
    newUser.setPassword(password);
    await newUser.save();
    sendVerificationMail(email, verificationToken);
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        user: {
          email,
          subscription: newUser.subscription,
          avatarURL,
          verificationToken,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const validationResult = userSchema.validate(req.body);
  if (validationResult.error) {
    return res.json({
      status: validationResult.error.details[0].message,
      code: 401,
      message: "Email or password is wrong",
    });
  }
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.validPassword(password)) {
    return res.status(400).json({
      status: "error",
      code: 400,
      message: "Incorrect login or password",
      data: "Bad request",
    });
  }

  const payload = {
    id: user.id,
    email: user.email,
  };

  const token = jwt.sign(payload, secret, { expiresIn: "1h" });
  await User.findByIdAndUpdate({ _id: user._id }, { $set: { token } });
  res.json({
    status: "success",
    code: 200,
    data: {
      token,
      user: {
        email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      },
    },
  });
};

const logout = async (req, res, next) => {
  const user = await User.findOne({ _id: req.user.id });
  console.log(user);
  if (!user) {
    return res.status(401).json({
      status: "error",
      code: 401,
      message: "Incorrect login or password",
      data: "Unauthorized",
    });
  }
  await User.findByIdAndUpdate({ _id: req.user.id }, { $set: { token: null } });
  return res.status(204).json();
};

const current = async (req, res, next) => {
  const user = await User.findById({ _id: req.user.id });

  return res.status(200).json({
    email: user.email,
    subscription: user.subscription,
  });
};

const updateSubscription = async (req, res, next) => {
  const { _id } = req.user;

  const { subscription = "starter" } = req.body;

  try {
    const user = await service.updateUserSubscription(_id, {
      subscription,
    });
    if (!user) {
      res.json({
        status: "success",
        code: 404,
        message: "Not found",
      });
    } else {
      res.json({
        status: "success",
        code: 200,
        data: {
          email: user.email,
          subscription: req.body.subscription,
        },
      });
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
};

const updateAvatar = async (req, res, next) => {
  const { _id } = req.user;
  const { originalname } = req.file;
  const tempUpload = req.file.path;
  const filename = `${_id}_${originalname}`;
  const newPathFile = path.join(__dirname, "../", "public", "avatars");
  const resultUpload = path.join(newPathFile, filename);

  try {
    await fs.rename(tempUpload, resultUpload);
    const resizeFile = await Jimp.read(resultUpload);
    await resizeFile.resize(250, 250).writeAsync(resultUpload);
    const avatarURL = path.join("avatar", filename);
    const user = await service.updateUserAvatar(_id, {
      avatarURL,
    });

    return res.json({
      status: "success",
      code: 200,
      data: { avatarURL: user.avatarURL },
    });
  } catch (err) {
    await fs.unlink(tempUpload);
    return next(err);
  }
};

const verifyUser = async (req, res, next) => {
  const verificationToken = req.params.verificationToken;
  const user = await User.findOne({ verificationToken });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  await User.findByIdAndUpdate(
    { _id: user._id },
    { $set: { verificationToken: null, verify: true } }
  );
  return res.status(200).json({ message: "Verification successful" });
};

const verificationRetry = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Missing required field email" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Email or password is wrong" });
  }
  const { verify } = user;
  if (verify) {
    return res
      .status(401)
      .json({ message: "Verification has already been passed" });
  }
  sendVerificationMail(email, user.verificationToken);
  return res.status(200).json({ message: "Verification email sent" });
};

module.exports = {
  registration,
  login,
  logout,
  current,
  updateSubscription,
  updateAvatar,
  verifyUser,
  verificationRetry,
};
