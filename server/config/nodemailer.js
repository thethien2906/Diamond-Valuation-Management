const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
  logger: true,
  debug: true,
  connectionTimeout: 2 * 60 * 1000, // 2 minutes
  greetingTimeout: 2 * 60 * 1000, // 2 minutes
  socketTimeout: 2 * 60 * 1000 // 2 minutes
});

transporter.verify(function (error, success) {
  if (error) {
    console.log('Error with SMTP configuration:', error);
  } else {
    console.log('SMTP configuration is correct:', success);
  }
});

module.exports = transporter;
