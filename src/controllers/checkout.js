const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Store = require('../models/Store');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const { NotFoundError, BadRequestError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const sendEmail = require('../config/nodemailer');

const checkout = async (req, res) => {
   const {
      body: { orderId },
      user: { userId },
   } = req;

   const order = await Order.findOne({ _id: orderId, userId });

   if (!order) {
      throw new NotFoundError(
         `Não existe nenhum pedido com este ID: ${orderId} desta conta.`
      );
   }

   const lineItems = await Promise.all(
      order.items.map(async (item) => {
         const product = await Product.findById(item.productId).lean();

         if (!product)
            throw new BadRequestError(
               `Produto com ID ${item.productId} não encontrado`
            );

         return {
            price_data: {
               currency: 'eur',
               product_data: {
                  name: product.name,
               },
               unit_amount: item.unitPrice,
            },
            quantity: item.quantity,
         };
      })
   );

   const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.URL}/cancel`,
      metadata: {
         orderId: order._id.toString(),
         sellerId: order.sellerId.toString(),
      },
   });

   res.status(StatusCodes.OK).json({ url: session.url });
};

const handlePaymentSuccess = async (req, res) => {
   const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id
   );
   const orderId = session.metadata.orderId;
   const sellerId = session.metadata.sellerId;

   if (!orderId || !sellerId) {
      throw new BadRequestError(
         'Adicione os parâmetros orderId e sellerId à API de requisição.'
      );
   }

   const order = await Order.findByIdAndUpdate(orderId, { status: 'pago' });
   const seller = await User.findById(sellerId);

   if (!order) {
      throw new BadRequestError(`Nenhum pedido com este ID: ${orderId}.`);
   } else if (!seller) {
      throw new NotFoundError(
         'Não existe nenhuma conta vendedor associado à este email.'
      );
   }

   const msg = `<p>Ola Sr(a). ${seller.name}! Recebeu a confirmação do pagamento de produto(s) do seguinte cliente:</p>
      <p>Nome: <strong>${order.customerName}</strong></p>
      <p>Telefone: <strong>${order.customerPhone}</strong></p>
      <p>Endereço: <strong>${order.customerAddress}</strong></p>
      <p>Estado do Pedido: ${order.status}
      <strong>Por favor acesse o seu paínel para o envio do(s) produto(s)!</strong>`;

   const store = await Store.findOne({ owner: seller });

   sendEmail(msg, 'Pagamento de produtos.', seller.email);

   res.status(StatusCodes.OK).json(
      `Status atualizado para pago e o vendedor foi notificado. O seu produto chegará no máximo em 3 dias, no caso de atraso contacte o vendedor, telefone: ${store.phone} ou por email: ${store.email}.`
   );
};

const handlePaymentCancel = (req, res) => {
   res.status(StatusCodes.OK).json({
      msg: 'O cliente cancelou o pedido e deve ser rederecionado para o carrinho.',
   });
};

module.exports = { checkout, handlePaymentSuccess, handlePaymentCancel };
