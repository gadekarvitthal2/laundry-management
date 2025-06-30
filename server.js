const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./Routes/Auth');
const dressMasterRoutes = require('./routes/dressMaster.routes');
const customerRoutes = require('./routes/customer.routes');
const orderRoutes = require('./routes/orders.routes');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/laundry-store', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
},console.log('Connected to MongoDB'));
app.use(cors());




app.use('/api/auth', authRoutes);
app.use('/api/dress-master', dressMasterRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/orders', orderRoutes);

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
