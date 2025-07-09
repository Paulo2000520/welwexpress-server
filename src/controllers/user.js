const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const register = async (req, res) => {
   const { name, email, password } = req.body;

   const newUser = new User({
      name,
      email,
      password,
      role: 'comprador(a)',
   });

   await newUser.save();

   const token = newUser.createJWT();

   res.status(StatusCodes.CREATED).json({
      user: {
         msg: 'Conta cadastrada com sucesso!',
         name: newUser.name,
         role: newUser.role,
      },
      token,
   });
};

const login = async (req, res) => {
   const { email, password } = req.body;

   if (!email || !password) {
      throw new BadRequestError(
         'Por favor, insira o seu email e palavra-passe!'
      );
   }

   const user = await User.findOne({ email });

   if (!user) {
      throw new NotFoundError('Não existe uma conta associada a este email!');
   }

   const checkPassword = await user.comparePassword(password);

   if (!checkPassword) {
      throw new BadRequestError('Palavra-passe incorreta!');
   }

   const token = user.createJWT();

   res.status(StatusCodes.OK).json({
      user: { name: user.name, role: user.role },
      token,
   });
};

const getUser = async (req, res) => {
   const { id } = req.params;

   const user = await User.findById({ _id: id }).select('-password');

   if (!user) {
      throw new NotFoundError('Não existe um usário com este ID.');
   }

   res.status(StatusCodes.OK).json(user);
};

const updateUser = async (req, res) => {
   const { id } = req.params;

   let { password, ...otherData } = req.body;

   if (password) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
   }

   const user = await User.findOneAndUpdate(
      { _id: id },
      { ...otherData, ...(password && { password }) },
      {
         new: true,
         runValidators: true,
      }
   ).select('-password');

   if (!user) {
      throw new NotFoundError('Não existe um usário com este ID.');
   }

   res.status(StatusCodes.OK).json({ user });
};

const deleteUser = async (req, res) => {
   const { id } = req.params;

   const user = await User.findByIdAndDelete({ _id: id });

   if (!user) {
      throw new NotFoundError('Não existe um usário com este ID.');
   }

   res.status(StatusCodes.OK).json({ msg: 'Conta eliminada com sucesso.' });
};

module.exports = { register, login, getUser, deleteUser, updateUser };
