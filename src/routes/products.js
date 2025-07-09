const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authentication');
const verifySeller = require('../middlewares/verify-seller');
const upload = require('../middlewares/upload');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - qty
 *       properties:
 *         id:
 *           type: string
 *           description: ID gerado automaticamente para o produto
 *         name:
 *           type: string
 *           description: Nome do produto
 *         price:
 *           type: number
 *           description: Preço do produto
 *         desc:
 *           type: string
 *           description: Descrição detalhada do produto
 *         category:
 *           type: string
 *           description: Categoria do produto
 *         colors:
 *           type: array
 *           items:
 *             type: string
 *           description: Cores disponíveis do produto
 *         sizes:
 *           type: array
 *           items:
 *             type: string
 *           description: Tamanhos disponíveis do produto
 *         qty:
 *           type: number
 *           description: Quantidade disponível em stock
 *         image:
 *           type: string
 *           description: URL da imagem principal do produto
 *         storeId:
 *           type: string
 *           description: ID da loja que cadastrou o produto
 *       example:
 *         id: "6630abf82905a452c68f6d91"
 *         name: "Tênis de Corrida"
 *         price: 599.99
 *         desc: "Tênis confortável para corridas de longa distância."
 *         category: "Desporto"
 *         colors:
 *           - "Azul"
 *           - "Preto"
 *         sizes:
 *           - "40"
 *           - "41"
 *           - "42"
 *         qty: 50
 *         image: "https://example.com/images/tenis-corrida.jpg"
 *         storeId: "662f04dc2905a452c68f5e4c"
 *
 *     UpdateProduct:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nome atualizado do produto
 *         price:
 *           type: number
 *           description: Preço atualizado do produto
 *         desc:
 *           type: string
 *           description: Nova descrição do produto
 *         category:
 *           type: string
 *           description: Nova categoria do produto
 *         colors:
 *           type: array
 *           items:
 *             type: string
 *           description: Novas cores disponíveis
 *         sizes:
 *           type: array
 *           items:
 *             type: string
 *           description: Novos tamanhos disponíveis
 *         qty:
 *           type: number
 *           description: Quantidade atualizada em stock
 *         image:
 *           type: string
 *           description: URL atualizada da imagem
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Cria um novo produto
 *     tags: [Product]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *
 *   get:
 *     summary: Busca todos os produtos
 *     tags: [Product]
 *     responses:
 *       200:
 *         description: Lista de produtos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *
 * /products/{id}:
 *   put:
 *     summary: Atualiza um produto existente
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProduct'
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *       404:
 *         description: Produto não encontrado
 *
 *   delete:
 *     summary: Exclui um produto
 *     tags: [Product]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do produto a ser excluído
 *     responses:
 *       200:
 *         description: Produto excluído com sucesso
 *       404:
 *         description: Produto não encontrado
 */

const {
   getAllProducts,
   getProduct,
   createProduct,
   updateProduct,
   deleteProduct,
} = require('../controllers/products');

router
   .route('/products')
   .get(getAllProducts)
   .all(auth, verifySeller)
   .all(upload.single('image'))
   .post(createProduct);

router
   .route('/products/:id')
   .all(auth, verifySeller)
   .get(getProduct)
   .patch(updateProduct)
   .delete(deleteProduct);

module.exports = router;
