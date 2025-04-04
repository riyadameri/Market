const express = require('express');
require('dotenv').config();
require('./config/config');
//importing apis
const userRoutes = require('./routes/user');

const PORT = process.env.PORT || 5000;
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());


app.use('/user', userRoutes);



const server = app.listen(PORT, () => {
  console.log(`🖥 Server is running on port ${PORT}  ✅`);
}
);