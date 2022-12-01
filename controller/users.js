const jwt = require("jsonwebtoken");
const { User } = require("../service/schemas/users");
require("dotenv").config();
const secret = process.env.SECRET;
const userSchema = require("../service/schemas/users");
const service = require("../service/index");

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
  try {
    const newUser = new User({ email, password });
    newUser.setPassword(password);
    await newUser.save();
    res.status(201).json({
      status: "success",
      code: 201,
      data: {
        user: {
          email,
          subscription: newUser.subscription,
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

module.exports = {
  registration,
  login,
  logout,
  current,
  updateSubscription,
};
