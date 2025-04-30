const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const labelsRoute = require('./routes/labels');
const searchRoute = require('./routes/search');

app.use('/', labelsRoute);
app.use('/', searchRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
