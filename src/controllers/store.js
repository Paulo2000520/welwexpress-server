const User = require('../models/User');
const Store = require('../models/Store');
const { NotFoundError, UnauthenticatedError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const register = async (req, res) => {
   const {
      name,
      nif,
      email,
      phone,
      iban,
      commerce,
      province,
      address,
      owner,
      createdAt,
   } = req.body;

   const user = await User.findById(owner);

   if (!user) {
      throw new NotFoundError(
         `Não existe um prorietário de loja com este ID ${owner}.`
      );
   }

   if (user.role !== 'vendedor(a)') {
      throw new UnauthenticatedError(
         'Não podes cadastrar uma loja, com uma conta comprador(a)'
      );
   }

   const store = new Store({
      name,
      nif,
      email,
      phone,
      iban,
      commerce,
      province,
      address,
      owner,
      createdAt,
   });

   await store.save();

   res.status(StatusCodes.CREATED).json({
      msg: 'Loja cadastrada com sucesso!',
      store: store,
   });
};

/* This Middleware get all the existing stores in the system, for this reason only Admin will

const getAllStores = async (req, res) => {
   const stores = await Store.find();

   res.status(StatusCodes.OK).json({ stores, nHibts: stores.length });
};

has the rigth to access the route. */

const getStore = async (req, res) => {
   const {
      user: { userId },
      params: { id: storeId },
   } = req;

   const store = await Store.findOne({ _id: storeId, owner: userId });

   if (!store) {
      throw new NotFoundError('Nenhuma loja associada a esta conta vendedor.');
   }

   res.status(StatusCodes.OK).json({ store });
};

const updateStore = async (req, res) => {
   const {
      user: { userId },
      params: { id: storeId },
   } = req;

   const store = await Store.findOneAndUpdate(
      { _id: storeId, owner: userId },
      req.body,
      { new: true, runValidators: true }
   );

   if (!store) {
      throw new NotFoundError('Nenhuma loja associada a esta conta vendedor.');
   }

   res.status(StatusCodes.OK).json({ store });
};

const deleteStore = async (req, res) => {
   const {
      user: { userId },
      params: { id: storeId },
   } = req;

   const store = await Store.findOneAndDelete({ _id: storeId, owner: userId });

   if (!store) {
      throw new NotFoundError('Nenhuma loja associada a esta conta vendedor.');
   }

   res.status(StatusCodes.OK).json({ msg: 'Conta Eliminada com sucesso' });
};

module.exports = { register, getStore, updateStore, deleteStore };
