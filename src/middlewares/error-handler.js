const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
   let customError = {
      statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      msg: err.message || 'Algo ocorreu mal, tente mais tarde.',
   };

   if (err.name === 'ValidationError') {
      customError.msg = Object.values(err.errors)
         .map((item) => item.message)
         .join(' ');

      customError.statusCode = StatusCodes.BAD_REQUEST;
   }

   if (err?.name === 'CastError') {
      customError.msg = 'ID incorreto.';
      customError.statusCode = StatusCodes.BAD_REQUEST;
   }

   if (err.code && err.code === 11000) {
      const error = !err.keyValue
         ? 'Algo ocorreu mal, tente mais tarde.'
         : Object.keys(err.keyValue);
      const typeofMsg = typeof error;

      const duplicateMsg = `Já existe um usuário com este ${
         typeofMsg === 'object' ? error[0] : ''
      }, tente outro.`;

      customError.msg = duplicateMsg;
      customError.statusCode = StatusCodes.BAD_REQUEST;
   }

   if (err?.errors?.name?.kind === 'maxlength') {
      customError.msg = 'Nome não deve conter mais de 30 caracteres.';
      customError.statusCode = StatusCodes.BAD_REQUEST;
   }

   if (err?.errors?.name?.kind === 'minlength') {
      customError.msg = 'Nome não deve conter menos de 3 caracteres.';
      customError.statusCode = StatusCodes.BAD_REQUEST;
   }

   res.status(customError.statusCode).json(customError.msg);
};

module.exports = errorHandlerMiddleware;
