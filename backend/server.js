const express = require('express');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');

// web 1
const authRoutes = require('./routers/authRouter');
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

// web 2
const bikeBuilderRouter = require('./routers/bikeBuilderRouter');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// app.use(cors());

// Apply CORS configuration
// app.use(cors({
//   origin: 'http://localhost:3000',  // Specify the frontend URL
//   credentials: true,  // Allow cookies (credentials) to be sent
// }));

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001'];

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

app.use(express.json());
app.use(cookieParser());
app.use(compression());


// web 1
app.use('/auth', authRoutes);
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

// web 2
app.use('/bike-builder', bikeBuilderRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});