const { VerificationHash } = require("../models");
const bcrypt = require("bcrypt-nodejs");
const EmailService = require("./nodemailer");

module.exports = sendVerificationEmail = (_id, email) => {
  let hashedData = new VerificationHash({ hash: email, user: _id });
  hashedData
    .save((err, data) => {
      let emailOptions = _createEmailOptions({
        verificationHash: data.verificationHash,
        user: data.user,
        email
      });
      return EmailService.send(emailOptions);
    })
    .then(result => {
      console.log(result);
      return;
    })
    .catch(err => {
      return err;
    });
};

const _createEmailOptions = userData => {
  return {
    from: "markhahn545@gmail.com",
    to: userData.email,
    subject: "Validate your Pale Blue account",
    html: `<p>Click this <a href="https://paleblue-server.herokuapp.com/email?hash=${userData.verificationHash}">link</a> to confirm your account.</p>
    <p>Link and account expire 24 hours after registration</p>`
  };
};
