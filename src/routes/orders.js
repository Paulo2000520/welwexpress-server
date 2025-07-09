const express = require('express');
const router = express.Router();
const {
   getAllOrdersBySeller,
   getOrder,
   createOrder,
   updateOrder,
   deleteOrder,
   getAllOrders,
} = require('../controllers/orders');
const auth = require('../middlewares/authentication');
const verifySeller = require('../middlewares/verify-seller');

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         productId:
 *           type: string
 *           description: ID do produto
 *         productName:
 *           type: string
 *           description: Nome do produto
 *         quantity:
 *           type: integer
 *           description: Quantidade de unidades
 *         unitPrice:
 *           type: number
 *           description: Preço unitário do produto
 *
 *     Order:
 *       type: object
 *       required:
 *         - userId
 *         - sellerId
 *         - items
 *         - totalAmount
 *       properties:
 *         id:
 *           type: string
 *           description: ID gerado automaticamente para o pedido
 *         userId:
 *           type: string
 *           description: ID do comprador
 *         sellerId:
 *           type: string
 *           description: ID do vendedor (dono da loja)
 *         customerName:
 *           type: string
 *           description: Nome do cliente (opcional)
 *         customerPhone:
 *           type: string
 *           description: Telefone do cliente (opcional)
 *         customerAddress:
 *           type: string
 *           description: Endereço de entrega do cliente (opcional)
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OrderItem'
 *           description: Lista de produtos no pedido
 *         totalAmount:
 *           type: number
 *           description: Valor total do pedido
 *         status:
 *           type: string
 *           enum:
 *             - pendente
 *             - pago
 *             - cancelado
 *             - enviado
 *           description: Estado atual do pedido
 *         paymentIntentId:
 *           type: string
 *           description: ID do pagamento (Stripe ou outro)
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         id: "6630b0e02905a452c68f7e21"
 *         userId: "662ef33a2905a452c68f4b2d"
 *         sellerId: "662ef5122905a452c68f4c90"
 *         customerName: "Carlos Silva"
 *         customerPhone: "+244912345678"
 *         customerAddress: "Luanda, Angola"
 *         items:
 *           - productId: "662fa38c2905a452c68f67d0"
 *             productName: "Camiseta Básica"
 *             quantity: 2
 *             unitPrice: 2500
 *         totalAmount: 5000
 *         status: "pendente"
 *         paymentIntentId: "pi_3NN3OpJ7zvN0vLsS1KkfsqGr"
 *         createdAt: "2025-04-28T08:45:23.123Z"
 *         updatedAt: "2025-04-28T08:45:23.123Z"
 *
 *     UpdateOrder:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum:
 *             - pendente
 *             - pago
 *             - cancelado
 *             - enviado
 *           description: Atualiza o estado do pedido
 *         paymentIntentId:
 *           type: string
 *           description: Atualiza o ID do pagamento
 */

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Cria um novo pedido
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *
 *   get:
 *     summary: Busca todos os pedidos
 *     tags: [Order]
 *     responses:
 *       200:
 *         description: Lista de pedidos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *
 * /orders/{sellerId}:
 *   get:
 *     summary: Busca todos os pedidos de um vendedor
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: sellerId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do vendedor
 *     responses:
 *       200:
 *         description: Lista de pedidos do vendedor retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *
 * /orders/{id}:
 *   put:
 *     summary: Atualiza um pedido existente
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrder'
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *       404:
 *         description: Pedido não encontrado
 *
 *   delete:
 *     summary: Exclui um pedido
 *     tags: [Order]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do pedido a ser excluído
 *     responses:
 *       200:
 *         description: Pedido excluído com sucesso
 *       404:
 *         description: Pedido não encontrado
 */

router
   .route('/orders')
   .all(auth)
   .get(getAllOrders)
   .post(createOrder)
   .all(verifySeller)
   .get(getAllOrdersBySeller);

router
   .route('/orders/:id')
   .all(auth)
   .get(getOrder)
   .patch(updateOrder)
   .delete(deleteOrder);

module.exports = router;
