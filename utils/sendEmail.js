"use strict";
const nodemailer = require("nodemailer");
const ejs = require("ejs");

const sendEmail = async (options) => {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    // secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  ejs.renderFile(
    __dirname + "/templates/welcome.ejs",
    { name: options.name },
    function async(err, data) {
      if (err) {
        console.log(err);
      } else {
        const message = {
          from: `${process.env.FROM} <${process.env.FROM}>`, // sender address
          to: options.email, // list of receivers
          subject: options.subject, // Subject line
          html: data,
          // text: options.message, // plain text body
        };

        const info = transporter.sendMail(message);

        console.log("Message sent: %s", info.messageId);
      }
    }
  );
  // send mail with defined transport object

  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};

module.exports = sendEmail;
