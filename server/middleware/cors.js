const cors = require('cors');

const corsOptions = {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);
