const express = require('express');
const router = express.Router();
const {
   checkout,
   handlePaymentSuccess,
   handlePaymentCancel,
} = require('../controllers/checkout');

const auth = require('../middlewares/authentication');

router.post('/checkout', auth, checkout);
router.get('/success', handlePaymentSuccess);
router.get('/cancel', handlePaymentCancel);

module.exports = router;
