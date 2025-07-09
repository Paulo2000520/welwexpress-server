const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
   productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
   productName: String,
   quantity: Number,
   unitPrice: Number,
});

const orderSchema = new mongoose.Schema(
   {
      userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },
      sellerId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
      },

      customerName: String,
      customerPhone: String,
      customerAddress: String,

      items: [itemSchema],

      totalAmount: { type: Number, required: true },
      status: {
         type: String,
         enum: ['pendente', 'pago', 'cancelado', 'enviado'],
         default: 'pendente',
      },

      paymentIntentId: String,
   },
   { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema, 'pedidos');
