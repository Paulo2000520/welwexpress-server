const jwt = require('jsonwebtoken');
const { UnauthenticatedError } = require('../errors');

const auth = (req, res, next) => {
   const authHeader = req.headers.authorization;

   if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new UnauthenticatedError('Acesso negado!');
   }

   const token = authHeader.split(' ')[1];

   try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      req.user = {
         userId: payload.userId || payload._id,
         name: payload.name,
         role: payload.role,
      };

      next();
   } catch (error) {
      throw new UnauthenticatedError('Acesso negado!');
   }
};

module.exports = auth;
