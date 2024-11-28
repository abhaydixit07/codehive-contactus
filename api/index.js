const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(express.json());

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // The email service's SMTP server
  port: 587,              // SMTP port
  secure: false,          // Use false for port 587
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS,  // Your App Password or Email Password
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certificates
  },
});

const auth_message = process.env.AUTH_MESSAGE;

app.post('/submit', (req, res) => {
  const { name, email, message } = req.body;
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader || authHeader !== auth_message) {
    return res.status(403).json({ message: 'Unauthorized request' });
  }

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const mailOptions = {
    from: 'yourgmail@gmail.com',
    to: process.env.EMAIL_USER,
    subject: 'New Contact Form Submission',
    text: `
      You have received a new message from your contact form:
      
      Name: ${name}
      Email: ${email}
      Message: ${message}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error sending email', error });
    } else {
      return res.status(200).json({ message: 'Email sent successfully', info });
    }
  });
});

  

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});