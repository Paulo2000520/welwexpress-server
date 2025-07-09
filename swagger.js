const swaggerJsDoc = require('swagger-jsdoc');

const options = {
   definition: {
      openapi: '3.0.0',
      info: {
         title: 'WelwExpress APIs',
         version: '1.0.0',
         description: '',
      },
      servers: [{ url: 'http://localhost:3000' }],
   },

   apis: ['./src/routes/*.js'], // ou o caminho onde estão tuas rotas
};

const specs = swaggerJsDoc(options);

module.exports = specs;
