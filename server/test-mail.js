require('dotenv').config();
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: 'yourdestination@gmail.com', // <-- put your own email here to test
  subject: 'Test Email',
  text: 'This is a test email from Nodemailer'
}, (err, info) => {
  if (err) return console.error(err);
  console.log('Email sent:', info.response);
});
