const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'O nome do produto é obrigatório'],
      capitalize: true,
      trim: true,
   },
   price: {
      type: Number,
      required: [true, 'O preço do produto é obrigatório'],
   },
   desc: {
      type: String,
      trim: true,
   },
   category: {
      type: String,
      capitalize: true,
      trim: true,
   },
   colors: {
      type: Array,
   },
   sizes: {
      type: Array,
   },
   qty: {
      type: Number,
      required: [true, 'A quantidade do produto é obrigatório'],
   },
   image: {
      type: String,
      trim: true,
   },
   storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
   },
});

module.exports = mongoose.model('Product', productSchema);
