const User = require('../models/User');
const Employee = require('../models/Employee');
const Store = require('../models/Store');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');
const path = require('path');
const { BadRequestError, NotFoundError } = require('../errors');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sendEmail = require('../config/nodemailer');

const generatePassword = (length = 10) => {
   return crypto.randomBytes(length).toString('hex').slice(0, length);
};

const seller = async (req, res) => {
   const { name, email, password } = req.body;

   if (!req.file) {
      throw new BadRequestError(
         'Envie uma imagem da sua alvará de comerciante.'
      );
   }

   const alvaraName = `${Date.now()}${path.extname(req.file.originalname)}`;

   const newSeller = new User({
      role: 'vendedor(a)',
      name,
      email,
      password,
      alvara: `/uploads/alvaras/${alvaraName}`,
   });

   await newSeller.save();

   const uploadPath = path.join(
      process.cwd(),
      'uploads',
      'alvaras',
      alvaraName
   );

   fs.writeFileSync(uploadPath, req.file.buffer);

   const token = newSeller.createJWT();

   res.status(StatusCodes.CREATED).json({
      user: {
         msg: 'Conta cadastrada com sucesso!',
         name: newSeller.name,
         role: newSeller.role,
      },
      token,
   });
};

const employee = async (req, res) => {
   let { name, bi, email, phone, address, store } = req.body;

   const isStore = await Store.findOne({ _id: store, owner: req.user.userId });

   if (!isStore) {
      throw new NotFoundError('Nenhuma loja com este ID.');
   }

   const employeePassword = generatePassword();

   const salt = await bcrypt.genSalt(10);
   const password = await bcrypt.hash(employeePassword, salt);

   const employee = new Employee({
      role: 'funcionario(a)',
      name,
      bi,
      email,
      password,
      phone,
      address,
      store,
   });

   await employee.save();

   const token = employee.createJWT();

   res.status(StatusCodes.CREATED).json({
      user: {
         msg: 'Conta cadastrada com sucesso!',
         name: employee.name,
         role: employee.role,
      },
      token,
   });

   const msg = `<p>Ola, Sr(a): ${name}! Foi criada uma conta funcionário com o teu email pela loja: 
      <strong>
         ${isStore.name}
      </strong>
      </p>
      <hr>
      <p>Dados de acesso: Email: <strong>${email}</strong></p>
      <p>Senha: <strong>${employeePassword}</strong></p>
      <hr>
      <p>Não partilhe com ninguém os teus dados de acesso, recomendamo-o a alterar a sua senha de acesso, obrigado!<p>
      <br>
      <a href="#">WelwExpress | Login</a>
      `;

   sendEmail(msg, 'Cadastro de conta para funcionário.', email);
};

module.exports = { seller, employee };
