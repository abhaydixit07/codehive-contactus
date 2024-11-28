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
    to: [process.env.EMAIL_USER, process.env.EMAIL_USER2],
    subject: '🌟 New Codehive Contact Form Submission 🌟',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; color: #333; padding: 20px; background: linear-gradient(to bottom, #f9f9f9, #fff); border: 1px solid #e5e5e5; border-radius: 12px; box-shadow: 0px 4px 8px rgba(0,0,0,0.1);">
        
        <!-- HEADER -->
        <header style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #ddd;">
          <h1 style="color: #4caf50; font-size: 24px; font-weight: bold; margin: 0;">
            ✨ You've Got a New Message! ✨
          </h1>
          <p style="font-size: 14px; color: #666; margin-top: 8px;">Sent via your website's contact form</p>
        </header>
  
        <!-- MAIN CONTENT -->
        <main style="padding: 20px; line-height: 1.6;">
          <p style="font-size: 16px; color: #444; text-align: center; margin-bottom: 20px;">
            A visitor has reached out to you. Here's what they shared:
          </p>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background-color: #fafafa; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background-color: #4caf50; color: white; text-align: left;">
                <th style="padding: 12px 16px; font-weight: bold;">Field</th>
                <th style="padding: 12px 16px; font-weight: bold;">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 12px 16px; border-bottom: 1px solid #ddd; background-color: #f9f9f9;">Name</td>
                <td style="padding: 12px 16px; border-bottom: 1px solid #ddd;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 16px; border-bottom: 1px solid #ddd;">Email</td>
                <td style="padding: 12px 16px; border-bottom: 1px solid #ddd;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 12px 16px; background-color: #f9f9f9;">Message</td>
                <td style="padding: 12px 16px;">${message}</td>
              </tr>
            </tbody>
          </table>
          <p style="font-size: 14px; color: #666; text-align: center; margin-top: 20px;">
            Please respond to the visitor promptly to build a great relationship.
          </p>
          <div style="text-align: center; margin-top: 20px;">
            <a href="mailto:${email}" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: white; background-color: #4caf50; text-decoration: none; border-radius: 8px; transition: background-color 0.3s ease;">
              Reply to ${name}
            </a>
          </div>
        </main>
  
        <!-- FOOTER -->
        <footer style="text-align: center; padding-top: 20px; border-top: 2px solid #ddd; margin-top: 20px;">
          <p style="font-size: 14px; color: #888; margin: 0;">
            © ${new Date().getFullYear()} Codehive | All rights reserved.
          </p>
          <p style="font-size: 12px; color: #aaa;">
            This email was automatically generated. Please do not reply to this email.
          </p>
        </footer>
      </div>
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