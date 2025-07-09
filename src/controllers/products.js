const Product = require('../models/Product');
const Store = require('../models/Store');
const fs = require('fs');
const path = require('path');
const { NotFoundError, BadRequestError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const getAllProducts = async (req, res) => {
   const store = await Store.findOne({ owner: req.user.userId });

   if (!store) {
      throw new NotFoundError('Loja não encontrada!');
   }

   const products = await Product.find({ storeId: store._id });

   res.status(StatusCodes.OK).json({ products, nHibts: products.length });
};

const createProduct = async (req, res) => {
   const store = await Store.findOne({ owner: req.user.userId });

   const { name, price, desc, category, colors, sizes, qty } = req.body;

   if (!req.file) {
      throw new BadRequestError('Adiciona a imagem do produto.');
   }

   let imageName = `${Date.now()}${path.extname(req.file.originalname)}`;

   const product = new Product({
      name,
      price,
      desc,
      category,
      colors: JSON.parse(colors),
      sizes: JSON.parse(sizes),
      qty,
      image: `/uploads/produtos/${imageName}`,
      storeId: store._id,
   });

   await product.save();

   const uploadPath = path.join(
      process.cwd(),
      'uploads',
      'produtos',
      imageName
   );

   fs.writeFileSync(uploadPath, req.file.buffer);

   res.status(StatusCodes.CREATED).json({
      msg: 'produto cadastrado com sucesso!',
      product,
   });
};

const getProduct = async (req, res) => {
   const {
      user,
      params: { id: productId },
   } = req;

   const store = await Store.find({ owner: user.userId });

   const product = await Product.find({
      _id: productId,
      storeId: store[0]._id,
   });

   if (product.length === 0) {
      throw new BadRequestError(
         `Não existe nenhum produto com este ID ${productId}`
      );
   }

   res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
   const {
      user,
      params: { id: productId },
   } = req;

   const store = await Store.find({ owner: user.userId });

   return console.log(store);

   if (!store) {
      throw new NotFoundError('Loja não encontrada!');
   }

   const product = await Product.findOneAndUpdate(
      { _id: productId, storeId: store._id },
      req.body,
      {
         new: true,
         runValidators: true,
      }
   );

   if (!product) {
      throw new BadRequestError(
         `Não existe nenhum produto com este ID ${productId}`
      );
   }

   res.status(StatusCodes.OK).json({
      msg: 'Produto atualizado com sucesso!',
      product,
   });
};

const deleteProduct = async (req, res) => {
   const {
      user,
      params: { id: productId },
   } = req;

   const store = await Store.find({ owner: user.userId });

   return console.log(store);

   if (!store) {
      throw new NotFoundError('Loja não encontrada!');
   }

   const product = await Product.findOneAndDelete({
      _id: productId,
      storeId: store[0]._id,
   });

   if (!product) {
      throw new NotFoundError(
         `Não existe nenhum produto com este ID ${productId}`
      );
   }

   res.status(StatusCodes.OK).json({ msg: 'Produto eliminado com sucesso!' });
};

module.exports = {
   getAllProducts,
   createProduct,
   getProduct,
   updateProduct,
   deleteProduct,
};
