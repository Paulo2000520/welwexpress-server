const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const employeeSchema = new mongoose.Schema({
   role: {
      type: String,
      enum: ['funcionario(a)'],
      required: true,
   },
   name: {
      type: String,
      required: [true, 'Insira o nome completo.'],
      minlength: 3,
      maxlength: 20,
      trim: true,
      capitalise: true,
   },
   email: {
      type: String,
      required: [true, 'Insira o email.'],
      match: [
         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
         'Por favor, forneça um email válido.',
      ],
      unique: true,
      lowercase: true,
   },
   password: {
      type: String,
   },
   bi: {
      type: String,
      required: true,
      unique: true,
      validate: {
         validator: function (v) {
            return /^\d{9}(BN|BG|BI|CA|CC|CN|CS|CU|HU|HI|LU|LN|LS|MA|MO|NN|UI|UE|ZA)\d[A-Z0-9]{1,2}$/i.test(
               v
            );
         },
         message: (props) => `B.I. Inválido: ${props.value}`,
      },
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
   address: {
      type: String,
      required: [true, 'O endereço é obrigatório.'],
   },
   store: {
      type: mongoose.Schema.Types.ObjectId,
      required: [
         true,
         'Insira o id da loja onde o funcionário será cadastrado.',
      ],
      ref: 'lojas',
   },
   createdAt: {
      type: Date,
      default: Date.now(),
   },
});

employeeSchema.methods.createJWT = function () {
   return jwt.sign(
      { userId: this._id, name: this.name, role: this.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME }
   );
};

module.exports = mongoose.model('Employee', employeeSchema, 'usuarios');
