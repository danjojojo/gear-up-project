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
const settingRoutes = require('./routers/settingsRouter');

// web 2
const bikeBuilderRouter = require('./routers/bikeBuilderRouter');
const checkoutRouter = require('./routers/checkoutRouter');
const webhookRouter = require('./routers/webhookRouter');
const userRouter = require('./routers/userRouter');

// util
const startOrderExpiryScheduler = require('./utils/orderScheduler');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

let allowedOrigins = [];
const isProduction = process.env.NODE_ENV === 'production';


if(isProduction) {
   allowedOrigins = 
    [
      'https://gearupmanager.vercel.app',
      'https://gearupbuilder.vercel.app'
    ];
} else {
  allowedOrigins = 
    [
      'http://localhost:3000', 
      'http://localhost:3001',
      'https://fairly-related-martin.ngrok-free.app' // ngrok url for paymongo webhook
    ];
}

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error("CORS error for origin:", origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    next();
});

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
app.use('/settings', settingRoutes);

// web 2
app.use('/bike-builder', bikeBuilderRouter);
app.use('/checkout', checkoutRouter);
app.use('/webhook', webhookRouter);
app.use('/user', userRouter);

startOrderExpiryScheduler();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});