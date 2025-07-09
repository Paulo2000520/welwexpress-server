const express = require('express');
const router = express.Router();

const auth = require('../middlewares/authentication');
const verifySeller = require('../middlewares/verify-seller');

/**
 * @swagger
 * components:
 *   schemas:
 *     Store:
 *       type: object
 *       required:
 *         - name
 *         - nif
 *         - email
 *         - phone
 *         - iban
 *         - province
 *         - address
 *         - owner
 *       properties:
 *         id:
 *           type: string
 *           description: ID gerado automaticamente para a loja
 *         name:
 *           type: string
 *           description: Nome da loja
 *         nif:
 *           type: string
 *           description: Número de Identificação Fiscal (NIF) da loja (14 dígitos)
 *         email:
 *           type: string
 *           description: Email da loja
 *         phone:
 *           type: string
 *           description: Telefone da loja
 *         iban:
 *           type: string
 *           description: IBAN angolano (AO seguido de 21 dígitos)
 *         commerce:
 *           type: string
 *           description: Área de comércio da loja (opcional)
 *         province:
 *           type: string
 *           description: Província onde a loja está localizada
 *           enum:
 *             - Bengo
 *             - Benguela
 *             - Bié
 *             - Cabinda
 *             - Cuando
 *             - Cubango
 *             - Cuanza Norte
 *             - Cuanza Sul
 *             - Cunene
 *             - Huambo
 *             - Huíla
 *             - Icole e Bengo
 *             - Luanda
 *             - Lunda Norte
 *             - Lunda Sul
 *             - Malanje
 *             - Moxico
 *             - Moxico-Leste
 *             - Namibe
 *             - Uíge
 *             - Zaire
 *         address:
 *           type: string
 *           description: Endereço completo da loja
 *         owner:
 *           type: string
 *           description: ID do dono da loja (referência a User)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação da loja
 *       example:
 *         id: "662f04dc2905a452c68f5e4c"
 *         name: "Tech Solutions"
 *         nif: "12345678901234"
 *         email: "techsolutions@email.com"
 *         phone: "923123456"
 *         iban: "AO06004400006712345678901"
 *         commerce: "Informática e acessórios"
 *         province: "Luanda"
 *         address: "Rua das Acácias, nº 120, Luanda"
 *         owner: "662f03b52905a452c68f5e48"
 *         createdAt: "2025-04-28T10:15:30.000Z"
 *
 *     UpdateStore:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nome atualizado da loja
 *         nif:
 *           type: string
 *           description: Novo NIF da loja
 *         email:
 *           type: string
 *           description: Novo email da loja
 *         phone:
 *           type: string
 *           description: Novo número de telefone
 *         iban:
 *           type: string
 *           description: Novo IBAN
 *         commerce:
 *           type: string
 *           description: Novo ramo de comércio
 *         province:
 *           type: string
 *           description: Nova província
 *           enum:
 *             - Bengo
 *             - Benguela
 *             - Bié
 *             - Cabinda
 *             - Cuando
 *             - Cubango
 *             - Cuanza Norte
 *             - Cuanza Sul
 *             - Cunene
 *             - Huambo
 *             - Huíla
 *             - Icole e Bengo
 *             - Luanda
 *             - Lunda Norte
 *             - Lunda Sul
 *             - Malanje
 *             - Moxico
 *             - Moxico-Leste
 *             - Namibe
 *             - Uíge
 *             - Zaire
 *         address:
 *           type: string
 *           description: Novo endereço
 */

/**
 * @swagger
 * /stores:
 *   post:
 *     summary: Registra uma nova loja
 *     tags: [Store]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Store'
 *     responses:
 *       201:
 *         description: Loja criada com sucesso
 *
 * /stores/{id}:
 *   put:
 *     summary: Atualiza uma loja existente
 *     tags: [Store]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da loja a ser atualizada
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStore'
 *     responses:
 *       200:
 *         description: Loja atualizada com sucesso
 *       404:
 *         description: Loja não encontrada
 *
 *   delete:
 *     summary: Exclui uma loja
 *     tags: [Store]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da loja a ser excluída
 *     responses:
 *       200:
 *         description: Loja excluída com sucesso
 *       404:
 *         description: Loja não encontrada
 */

const {
   register,
   getStore,
   updateStore,
   deleteStore,
} = require('../controllers/store');

router.post('/stores', auth, verifySeller, register);
// router.route('/stores').get(getAllStores);
router
   .route('/stores/:id')
   .all(auth, verifySeller)
   .get(getStore)
   .patch(updateStore)
   .delete(deleteStore);

module.exports = router;
