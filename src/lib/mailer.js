const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "189afffcbad8a6",
    pass: "b47eee688c760a"
  }
});