require('dotenv').config();
const express = require('express');
const app = express();
const userRoutes = require('./routes/user');
const mongoose = require('mongoose');

//middleware
app.use(express.json());
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

//routes
app.use('/api/user', userRoutes);

//connect to db
mongoose
  .connect(process.env.URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('connected to db on ', process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
