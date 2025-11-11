const nodemailer = require('nodemailer');
const { smtp } = require('../config');

const transporter = nodemailer.createTransport({
  host: smtp.host,
  port: smtp.port,
  secure: false,
  auth: { user: smtp.user, pass: smtp.pass }
});

exports.send = async ({ to, subject, html, text }) => {
  const info = await transporter.sendMail({ from: smtp.user, to, subject, text, html });
  return info;
};