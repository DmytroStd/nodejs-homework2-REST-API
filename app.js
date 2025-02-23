const express = require("express");
const logger = require("morgan");
const cors = require("cors");
// const path = require("path");

const contactsRouter = require("./routes/api/contacts");
const authRouter = require("./routes/api/users");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

require("./config/config-passport");

app.use("/avatars", express.static("public/avatars"));

app.use("/api/contacts", contactsRouter);

app.use("/api/users", authRouter);

// app.use("/avatars", express.static("public / avatars"));
// app.use("/avatars", express.static(STATIC_FILES_DIR));
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
