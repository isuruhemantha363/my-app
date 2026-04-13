const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB සම්බන්ධ කිරීම (මෙහි 'handylanka' යනු database නමයි)
mongoose.connect('mongodb://localhost:27017/handylanka')
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));

// User Schema එක සැකසීම
const userSchema = new mongoose.Schema({
    fullname: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: String // 'customer' හෝ 'employee'
});

const User = mongoose.model('User', userSchema);

// Register API එක
app.post('/register', async (req, res) => {
    try {
        const { fullname, email, password, role } = req.body;

        // දැනටමත් සිටිනවද බලන්න
        let user = await User.findOne({ email });
        if (user) return res.status(400).send({ message: "User already registered." });

        user = new User({ fullname, email, password, role });
        await user.save();

        res.status(201).send({ message: "Registration Successful!", role: user.role });
    } catch (error) {
        res.status(500).send({ message: "Error saving data" });
    }
});

// Login API එක
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // User කෙනෙක් ඉන්නවාද බලන්න
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send({ message: "User not found. Please register first." });
        }

        // Password පරීක්ෂා කිරීම (Database එකේ තියෙන password එක සහ input එක)
        if (user.password !== password) {
            return res.status(400).send({ message: "Invalid password." });
        }

        // සාර්ථක නම් විස්තර යැවීම
        res.status(200).send({ 
            message: "Login Successful!", 
            role: user.role,
            fullname: user.fullname 
        });

    } catch (error) {
        res.status(500).send({ message: "Server error" });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));