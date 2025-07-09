const Order = require('../models/Order');
const User = require('../models/User');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const { NotFoundError, BadRequestError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const sendEmail = require('../config/nodemailer');

const getAllOrdersBySeller = async (req, res) => {
   const { sellerId } = req.query;

   if (!sellerId) {
      throw new BadRequestError(
         'Adicione o parâmetro sellerId a tua string de busca.'
      );
   }

   const orders = await Order.find({ sellerId }).sort({ createdAt: -1 });

   res.status(StatusCodes.OK).json({ orders });
};

const getAllOrders = async (req, res) => {
   const orders = await Order.find({ userId: req.user.userId });

   if (!orders) {
      throw new NotFoundError('Nenhum pedido encontrado.');
   }

   res.status(StatusCodes.OK).json({ orders, nHibts: orders.length });
};

const getOrder = async (req, res) => {
   const {
      user: { userId },
      params: { id: orderId },
   } = req;

   const order = await Order.findOne({ _id: orderId, userId });

   if (!order) {
      throw new NotFoundError(
         `Não existe nenhum pedido com este ID: ${orderId} desta conta.`
      );
   }

   res.status(StatusCodes.OK).json({ order });
};

const createOrder = async (req, res) => {
   const {
      userId,
      sellerId,
      customerName,
      customerPhone,
      customerAddress,
      items,
   } = req.body;

   const totalAmount = items.reduce((acc, item) => {
      return acc + item.unitPrice * item.quantity;
   }, 0);

   const exchangeRate = 900; // 1 EUR = 900 Kz (exemplo)
   const amountInEurCents = Math.round((totalAmount / exchangeRate) * 100);

   const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInEurCents,
      currency: 'eur',
      metadata: { userId, sellerId },
   });

   const order = await Order.create({
      userId,
      sellerId,
      customerName,
      customerPhone,
      customerAddress,
      items,
      totalAmount,
      status: 'pendente',
      paymentIntentId: paymentIntent.id,
   });

   const seller = await User.findById(sellerId);

   const msg = `<p>Ola caro vendedor(a): ${seller.name}</p>
      <p>Recebeu um pedido deste cliente:</p>
      <p>Nome: <strong>${customerName}</strong></p>
      <p>Núnero de telefone: <strong>${customerPhone}</strong></p>
      <p>Endereço: <strong>${customerAddress}</strong></p>
      <p>Estado: Pendente</p>
      <hr>
      <p>Por favor acesse o seu painel para maior detalhe dos produtos.</p>
   `;

   sendEmail(msg, 'Pedido de Produto.', seller.email);

   res.status(StatusCodes.CREATED).json({
      msg: 'Pedido criado com sucesso!',
      orderId: order._id,
      clientSecret: paymentIntent.client_secret,
   });
};

const updateOrder = async (req, res) => {
   const {
      user: { userId },
      params: { id: orderId },
   } = req;

   let total = 0;

   req.body.items.forEach((item) => {
      total += item.quantity * item.unitPrice;
   });

   req.body.totalAmount = total;

   const order = await Order.findOneAndUpdate(
      { _id: orderId, userId },
      req.body,
      {
         new: true,
         runValidators: true,
      }
   );

   if (!order) {
      throw new NotFoundError(
         `Não existe nenhum pedido com este ID: ${orderId} desta conta.`
      );
   }

   res.status(StatusCodes.OK).json({ order });
};

const deleteOrder = async (req, res) => {
   const {
      user: { userId },
      params: { id: orderId },
   } = req;

   const order = await Order.findOneAndDelete({ _id: orderId, userId });

   if (!order) {
      throw new NotFoundError(
         `Não existe nenhum pedido com este ID: ${orderId} desta.`
      );
   }

   res.status(StatusCodes.OK).json({ msg: 'Pedido eliminado com sucesso!' });
};

module.exports = {
   getAllOrdersBySeller,
   getAllOrders,
   getOrder,
   createOrder,
   updateOrder,
   deleteOrder,
};
