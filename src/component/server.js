const express = require('express');
const bodyParser = require('body-parser');
const Razorpay = require('razorpay');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

const razorpay = new Razorpay({
  key_id: 'rzp_test_nVdfx3fEvt4C0T',
  key_secret: 'SaM1Xdz8hSRSKytspvmLZovk',
});

app.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: 'order_receipt', // You can use your own order receipt identifier
      payment_capture: 1, // Auto-capture payment
    };

    const order = await razorpay.orders.create(options);

    res.json({
      paymentId: order.id,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Error creating order' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});