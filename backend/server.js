const express = require('express');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');

// web 1
const authRoutes = require('./routers/authRouter');
const dashboardRoutes = require('./routers/dashboardRouter');
const inventoryRoutes = require('./routers/inventoryRouter');
const waitlistRoutes = require('./routers/waitlistRouter');
const bbuRoutes = require('./routers/bbuRouter');
const posRoutes = require('./routers/posRouter');
const receiptRoutes = require('./routers/receiptRouter');
const expenseRoutes = require('./routers/expenseRouter');
const posUsersRoutes = require('./routers/posUsersRouter');
const recordsRoutes = require('./routers/recordsRouter');
const summaryRoutes = require('./routers/summaryRouter');
const mechanicRoutes = require('./routers/mechanicsRouter');
const reportsRoutes = require('./routers/reportsRouter');
const orderRoutes = require('./routers/orderRouter');

// web 2
const bikeBuilderRouter = require('./routers/bikeBuilderRouter');
const checkoutRouter = require('./routers/checkoutRouter');
const webhookRouter = require('./routers/webhookRouter');

// util
const startOrderExpiryScheduler = require('./utils/orderScheduler');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// const allowedOrigins = 
//  [
//     'http://localhost:3000', 
//     'http://localhost:3001',  
//     'http://192.168.18.7:3001',
//     'https://4274-149-30-138-2.ngrok-free.app',
//     'https://424b-149-30-138-2.ngrok-free.app',
//     'https://2007-149-30-138-2.ngrok-free.app',
//     'https://gear-up-project.vercel.app',
//     'https://gearupmanager.vercel.app',
//     'https://gearupbuilder.vercel.app',
//   ];

const allowedOrigins = 
  [
    'https://gearupmanager.vercel.app',
    'https://gearupbuilder.vercel.app'
  ];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());


// web 1
app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/waitlist', waitlistRoutes);
app.use('/bike-builder-upgrader', bbuRoutes);
app.use('/pos', posRoutes);
app.use('/receipt', receiptRoutes);
app.use('/expense', expenseRoutes);
app.use('/pos-users', posUsersRoutes);
app.use('/records', recordsRoutes);
app.use('/summary', summaryRoutes);
app.use('/mechanics', mechanicRoutes);
app.use('/reports', reportsRoutes);
app.use('/orders', orderRoutes);

// web 2
app.use('/bike-builder', bikeBuilderRouter);
app.use('/checkout', checkoutRouter);
app.use('/webhook', webhookRouter);

startOrderExpiryScheduler();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});