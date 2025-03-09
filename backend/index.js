const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const schoolRoutes = require('./routes/schoolRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import Routes

app.use('/api/schools', schoolRoutes);

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
