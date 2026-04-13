const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Email එක යවන්න setup එක (Gmail භාවිතා කරන්නේ නම්)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'isuruhem2003@gmail.com', // ඔයාගේ email එක
        pass: 'bmhp hzfx fvzf rgja'     // Gmail App Password එක (සාමාන්‍ය password එක නෙවෙයි)
    }
});

app.post('/send-message', (req, res) => {
    const { name, email, subject, message } = req.body;

    const mailOptions = {
        from: email,
        to: 'isuruhem2003@gmail.com', // පණිවිඩය ලැබිය යුතු email එක
        subject: `Contact Form: ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send("Error occurred");
        }
        res.status(200).send("Success");
    });
});

app.listen(5000, () => console.log('Server running on port 5000'));