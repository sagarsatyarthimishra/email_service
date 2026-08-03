const express = require("express");
const cors = require("cors");
require("dotenv").config();

const transporter = require("./mail");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("Email Service Running...");
});

app.post("/send-email", async (req, res) => {
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);

    try {

        const { name, email, phone, service } = req.body;

        if (!name || !email || !phone || !service) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const mailOptions = {
            from: `"CA Vinay Jagdish" <${process.env.EMAIL_USER}>`,
            to: process.env.RECEIVER_EMAIL,
            replyTo: email,
            subject: `📩 New Booking Request - ${service}`,
            text: `
New Booking Request

Name: ${name}
Email: ${email}
Phone: ${phone}
Service: ${service}
`,
            html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>

<body style="margin:0;padding:0;background:#f5f7fa;font-family:Arial,sans-serif;">

<div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e5e5;">

    <div style="background:#0B6E4F;padding:30px;text-align:center;color:white;">
        <h1 style="margin:0;font-size:28px;">CA Vinay Jagdish</h1>
        <p style="margin-top:10px;font-size:15px;">
            New Book Now Request
        </p>
    </div>

    <div style="padding:35px;">

        <h2 style="margin-top:0;color:#222;">
            New Customer Inquiry
        </h2>

        <p style="color:#555;">
            A visitor has submitted a booking request from the website.
        </p>

        <div style="background:#f7f7f7;padding:20px;border-radius:10px;">

            <p><strong>👤 Name</strong><br>${name}</p>

            <p><strong>📧 Email</strong><br>${email}</p>

            <p><strong>📱 Phone</strong><br>${phone}</p>

            <p><strong>🛠 Service</strong><br>${service}</p>

        </div>

        <div style="margin-top:30px;text-align:center;">

            <a href="tel:${phone}"
               style="display:inline-block;
               background:#0B6E4F;
               color:white;
               padding:14px 28px;
               text-decoration:none;
               border-radius:8px;
               font-weight:bold;
               margin-right:10px;">
               📞 Call Customer
            </a>

            <a href="mailto:${email}"
               style="display:inline-block;
               background:#1565C0;
               color:white;
               padding:14px 28px;
               text-decoration:none;
               border-radius:8px;
               font-weight:bold;">
               ✉ Reply Email
            </a>

        </div>

    </div>

    <div style="background:#f1f1f1;padding:20px;text-align:center;color:#777;font-size:13px;">
        This email was generated automatically from the
        <strong>CA Vinay Jagdish</strong> website.
    </div>

</div>

</body>
</html>
`
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent:", info);
        res.json({
            success: true,
            message: "Email Sent Successfully"
        });

    } catch (error) {

        console.error("Email Send Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

});

const PORT = process.env.PORT || 5000;

transporter.verify((error, success) => {
    if (error) {
        console.error("SMTP Error:", error);
    } else {
        console.log("SMTP Server is ready");
    }
});

app.listen(PORT, () => {
    console.log(`Server Running on Port ${PORT}`);
});