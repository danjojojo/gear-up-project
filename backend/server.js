const express = require('express');
const cors = require('cors');
const authRoutes = require('./routers/authRouter');
const inventoryRoutes = require('./routers/inventoryRouter');
const waitlistRoutes = require('./routers/waitlistRouter');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

app.use('/inventory', inventoryRoutes);

app.use('/waitlist', waitlistRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});