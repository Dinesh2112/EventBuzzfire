// index.js

require("dotenv").config();

const express = require('express');
const path = require('path');
const cors = require('cors');
const shortid = require('shortid');
const Razorpay = require('razorpay');


// Initialize razorpay credentials
const razorpayInstance = new Razorpay({
    key_id: "rzp_test_QhfXU8Z0AvSudT",
    key_secret: "9EGAPQPZLuuRHAbG0Xbfyoxj",
});

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse incoming JSON data
app.use(express.json());

// CORS middleware
app.use(cors());

// Route to serve logo.jpg
app.get('/HYPE.png', (req, res) => {
    res.sendFile(path.join(__dirname, "HYPE.png"));
});

// Route handler for the payment endpoint
app.post('/razorpay', async (req, res) => {
    const payment_capture = 1;
    const amount = req.body.amount; // Use req.body.amount instead of req.amount
    const currency = "INR";

    const options = {
        amount: amount,
        currency: currency,
        receipt: shortid.generate(),
        payment_capture
    };

    try {
        const response = await razorpayInstance.orders.create(options);
        console.log(response);
        res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
            description: 'sample',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error creating Razorpay order" });
    }
});

// Start the server
app.listen(port, () => console.log(`App listening at port ${port}`));
