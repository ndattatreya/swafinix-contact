const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve static files from the "public" directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify transporter connection without printing statements
transporter.verify(function(error, success) {});

transporter.verify((error, success) => {});

app.post('/api/contact', async (req, res) => {
    const { firstName, lastName, email, companyName, serviceInterested, message } = req.body;

    if (!firstName || !lastName || !email || !companyName || !serviceInterested || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Define paths for images
    const logoPath = path.join(__dirname, 'public', 'images', 'logo2.webp');
    const bannerPath = path.join(__dirname, 'public', 'images', 'banners', 'logo1.webp');

    // Setup email templates without image first
    const baseEmailTemplate = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px;">
            <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 30px;">
                {{content}}
            </div>
        </div>
    `;

    // Prepare mail options
    const userMailOptions = {
        from: `IT Solutions Team <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Thank you for your interest in our ${serviceInterested} services`,
        html: baseEmailTemplate.replace('{{content}}', `
            <img src="cid:logo1" alt="Welcome Banner" style="width: 100%; max-width: 600px; height: auto; margin-bottom: 20px; "/>
            <h2 style="color: #003B7E; text-align: center; border-bottom: 2px solid #003B7E; padding-bottom: 10px;">Thank You for Contacting Us</h2>
            
            <p>Dear ${firstName},</p>
            <p>We appreciate your interest in <strong>${serviceInterested}</strong>. Our team will review your request and respond within 24 hours.</p>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
                <h3>Next Steps:</h3>
                <ul>
                    <li>Our expert team will review your requirements</li>
                    <li>A specialized consultant will be assigned</li>
                    <li>You'll receive a response within 24 hours</li>
                </ul>
            </div>
            <p>Best Regards,<br><strong>IT Solutions Team</strong></p>
            <img src="cid:logo2" alt="Company Logo" style="display: block; margin: 0; margin-top: 10px; max-width: 150px; height: auto;"/>
        `),
        attachments: []
    };

    // Add attachments if files exist
    if (fs.existsSync(bannerPath)) {
        userMailOptions.attachments.push({
            filename: 'logo1.jpg',
            path: bannerPath,
            cid: 'logo1'
        });
    }

    if (fs.existsSync(logoPath)) {
        userMailOptions.attachments.push({
            filename: 'logo2.png',
            path: logoPath,
            cid: 'logo2'
        });
    }

    try {
        await transporter.sendMail(userMailOptions);
        console.log('User email sent successfully');

        // Send admin notification
        await transporter.sendMail({
            from: `Contact Form <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER,
            subject: 'New Contact Form Submission',
            html: baseEmailTemplate.replace('{{content}}', `
                <h2 style="color: #003B7E; text-align: center; border-bottom: 2px solid #003B7E; padding-bottom: 10px;">New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Company:</strong> ${companyName}</p>
                <p><strong>Service Interested:</strong> ${serviceInterested}</p>
                <p><strong>Message:</strong> ${message}</p>
            `)
        });
        console.log('Admin email sent successfully');

        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));