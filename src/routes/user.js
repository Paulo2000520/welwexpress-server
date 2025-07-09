const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const auth = require('../middlewares/authentication');
const verifySeller = require('../middlewares/verify-seller');

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterUser:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *       properties:
 *         id:
 *           type: string
 *           description: ID gerado automaticamente para o usuário
 *         name:
 *           type: string
 *           description: Nome do usuário
 *         email:
 *           type: string
 *           description: Email do usuário
 *         password:
 *           type: string
 *           description: Senha do usuário
 *         role:
 *           type: string
 *           description: Papel do usuário (comprador(a), vendedor(a), funcionário(a))
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Data de criação da conta
 *       example:
 *         id: "67e4e583e80a88b88e1d54fc"
 *         name: "João Silva"
 *         email: "joao@email.com"
 *         password: "$2a$10$c40oLck57y6vVSfrlpMwbOQoPaPSzo5eSToVoL4llrHOCH/jWFHuC"
 *         role: "comprador(a)"
 *         createdAt: "2025-03-27T05:42:54.905Z"
 *
 *     RegisterSeller:
 *       allOf:
 *         - $ref: '#/components/schemas/RegisterUser'
 *         - type: object
 *           required:
 *             - alvara
 *           properties:
 *             alvara:
 *               type: string
 *               description: Licença de comércio usada em Angola
 *       example:
 *         id: "67e4e583e80a88b88e1d54fc"
 *         name: "Domingas Liamuseco"
 *         email: "sldomingas@.com"
 *         password: "$2a$10$c40oLck57y6vVSfrlpMwbOQoPaPSzo5eSToVoL4llrHOCH/jWFHuC"
 *         role: "vendedor(a)"
 *         alvara: "1743853206721.png"
 *         createdAt: "2025-03-27T05:42:54.905Z"
 *
 *     RegisterEmployee:
 *       allOf:
 *         - $ref: '#/components/schemas/RegisterUser'
 *         - type: object
 *           required:
 *             - bi
 *             - phone
 *             - address
 *             - store
 *           properties:
 *             bi:
 *               type: string
 *               description: Bilhete de identidade do funcionário
 *             phone:
 *               type: string
 *               description: Número de telefone do funcionário
 *             address:
 *               type: string
 *               description: Endereço do funcionário
 *             store:
 *               type: string
 *               description: ID da loja a qual o funcionário pertence
 *       example:
 *         id: "21e4e583e80a88b88e1d54fb"
 *         name: "Paulo Caculo"
 *         email: "cacuolo.com"
 *         password: "$2a$10$c40oLck57y6vVSfrlpMwbOQoPaPSzo5eSToVoL4llrHOCH/jWFHuC"
 *         role: "funcionário(a)"
 *         bi: "008127076UE040"
 *         phone: "947153247"
 *         address: "Luanda, Cazenga"
 *         store: "67f527034d955519871478eb"
 *         createdAt: "2025-03-27T05:42:54.905Z"
 *
 *     LoginUser:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Email do usuário
 *         password:
 *           type: string
 *           description: Senha de acesso
 *       example:
 *         email: "ilda@gmail.com"
 *         password: "1234567"
 *
 *     UpdateUser:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nome atualizado do usuário
 *         email:
 *           type: string
 *           description: Email atualizado do usuário
 *         password:
 *           type: string
 *           description: Nova senha do usuário
 *         address:
 *           type: string
 *           description: Novo endereço (para funcionários e opcionalmente outros)
 *         phone:
 *           type: string
 *           description: Novo número de telefone (para funcionários e opcionalmente outros)
 *         alvara:
 *           type: string
 *           description: Novo alvará (para vendedores)
 *         bi:
 *           type: string
 *           description: Novo bilhete de identidade (para funcionários)
 *         store:
 *           type: string
 *           description: Novo ID da loja (para funcionários)
 *       example:
 *         name: "Nome Atualizado"
 *         email: "novo@email.com"
 *         password: "novasenha123"
 *         address: "Nova morada"
 *         phone: "923456789"
 *         alvara: "novoAlvara.png"
 *         bi: "987654321UE020"
 *         store: "67f527034d955519871478eb"
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário (comprador, vendedor ou funcionário)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/RegisterUser'
 *               - $ref: '#/components/schemas/RegisterSeller'
 *               - $ref: '#/components/schemas/RegisterEmployee'
 *     responses:
 *       201:
 *         description: Conta cadastrada com sucesso
 *
 * /auth/login:
 *   post:
 *     summary: Realiza o login do usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 *
 * /users/{id}:
 *   put:
 *     summary: Atualiza os dados de um usuário existente
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUser'
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       404:
 *         description: Usuário não encontrado
 *
 *   delete:
 *     summary: Exclui um usuário
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário a ser excluído
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso
 *       404:
 *         description: Usuário não encontrado
 */

const {
   register,
   login,
   getUser,
   updateUser,
   deleteUser,
} = require('../controllers/user');

const { seller, employee } = require('../controllers/store.users');

router.post('/auth/register', register);

router.post('/auth/employee-register', auth, verifySeller, employee);
router.post('/auth/seller-register', upload.single('alvara'), seller);

router.post('/auth/login', login);

router
   .route('/users/:id')
   .all(auth)
   .get(getUser)
   .patch(updateUser)
   .delete(deleteUser);

module.exports = router;
