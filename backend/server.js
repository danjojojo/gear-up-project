const express = require('express');
const cors = require('cors');
const compression = require('compression');

// web 1
const authRoutes = require('./routers/authRouter');
const inventoryRoutes = require('./routers/inventoryRouter');
const waitlistRoutes = require('./routers/waitlistRouter');
const bbuRoutes = require('./routers/bbuRouter');

// web 2
const bikeBuilderRouter = require('./routers/bikeBuilderRouter');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(compression());


// web 1
app.use('/auth', authRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/waitlist', waitlistRoutes);
app.use('/bike-builder-upgrader', bbuRoutes);

// web 2
app.use('/bike-builder', bikeBuilderRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});