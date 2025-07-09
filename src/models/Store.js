const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Insira o nome da loja.'],
      minlength: 3,
      maxlength: 30,
      trim: true,
      capitalise: true,
   },
   nif: {
      type: String,
      required: [true, 'Insira o NIF da tua loja.'],
      unique: true,
      match: [/^\d{14}$/, 'O NIF deve ter exatamente 14 dígitos numéricos.'],
   },
   email: {
      type: String,
      required: [true, 'Insira o email da loja.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Este email não é válido.'],
   },
   phone: {
      type: String,
      required: [true, 'O número de telefone é obrigatório.'],
      unique: true,
      match: [
         /^(?:\+244\s?)?9\d{2}[\s.-]?\d{3}[\s.-]?\d{3}$/,
         'Insira um número de telefone válido.',
      ],
   },
   iban: {
      type: String,
      required: [true, 'Insira o IBAN onde deseja receber os pagamentos.'],
      unique: true,
      match: [
         /^AO\d{21}$/,
         "O IBAN deve começar com 'AO' seguido de 21 dígitos numéricos.",
      ],
   },
   commerce: {
      type: String,
      maxlength: 100,
      trim: true,
   },
   province: {
      type: String,
      required: [true, 'A província é obrigatória'],
      trim: true,
      capitalise: true,
      enum: {
         values: [
            'Bengo',
            'Benguela',
            'Bié',
            'Cabinda',
            'Cuando',
            'Cubango',
            'Cuanza Norte',
            'Cuanza Sul',
            'Cunene',
            'Huambo',
            'Huíla',
            'Icole e Bengo',
            'Luanda',
            'Lunda Norte',
            'Lunda Sul',
            'Malanje',
            'Moxico',
            'Moxico-Leste',
            'Namibe',
            'Uíge',
            'Zaire',
         ],
         message: '{VALUE} não é uma província válida de Angola.',
      },
   },
   address: {
      type: String,
      required: [true, 'O endereço é obrigatório.'],
   },
   owner: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
   },
   createdAt: {
      type: Date,
      default: Date.now(),
   },
});

module.exports = mongoose.model('Store', storeSchema, 'lojas');
