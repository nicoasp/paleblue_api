const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");

const _options = {
  service: "SendGrid",
  auth: {
    api_user: process.env.SENDGRID_USERNAME,
    api_key: process.env.SENDGRID_PASSWORD
  }
};

const _transporter = nodemailer.createTransport(sendGridTransport(_options));

const EmailService = {};

EmailService.send = options => {
  return new Promise((resolve, reject) => {
    _transporter.sendMail(options, (err, info) => {
      err ? reject(err) : resolve(info);
    });
  });
};

module.exports = EmailService;
