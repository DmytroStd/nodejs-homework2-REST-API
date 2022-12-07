const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const sendVerificationMail = (email, verificationToken) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: email,
    from: "stdformation.md@gmail.com",
    subject: "Email verification",
    html: `<a href="http://localhost:3030/api/users/verify/${verificationToken.toString()}">verify email ${email}</a>`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = sendVerificationMail;
