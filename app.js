require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const path = require('path');

const app = express();

const connect = require('./src/db/connect');

app.use(
   cors({
      origin: ['http://localhost/api/v1', 'http://127.0.0.1:5500'],
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
   })
);

app.use(express.json());

const specs = require('./swagger');

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use(
   '/uploads/produtos',
   express.static(path.join(__dirname, 'uploads', 'produtos'))
);

const sellerAuthRouter = require('./src/routes/user');
const userAuthRouter = require('./src/routes/user');
const employeeAuthRouter = require('./src/routes/user');

const storeRouter = require('./src/routes/store');
const productsRouter = require('./src/routes/products');
const ordersRouter = require('./src/routes/orders');
const checkoutRouter = require('./src/routes/checkout');

const notFound = require('./src/middlewares/not-found');
const errorHandlerMiddleware = require('./src/middlewares/error-handler');

app.use(process.env.BASE_URL, sellerAuthRouter);
app.use(process.env.BASE_URL, userAuthRouter);
app.use(process.env.BASE_URL, employeeAuthRouter);

app.use(process.env.BASE_URL, storeRouter);
app.use(process.env.BASE_URL, productsRouter);
app.use(process.env.BASE_URL, ordersRouter);
app.use(process.env.BASE_URL, checkoutRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
   try {
      await connect(process.env.MONGO_URI);
      app.listen(port, () =>
         console.log(`Server is running at http://localhost:${port}...`)
      );
   } catch (error) {
      console.log(error);
   }
};

start();
