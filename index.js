const express = require('express');
const app = express();
const adminRoutes = require('./src/routes/adminRoutes.js');
const userRoutes = require('./src/routes/userRoutes.js');
const eventRoutes = require('./src/routes/eventRoutes.js');
const volunteerRoutes = require('./src/routes/volunteerRoutes.js');
const feedbackRoutes = require('./src/routes/feedbackRoutes.js');

app.use(express.json());

const port = 3000;

app.get('/', (req, res) => {
  res.json({ message: "ok" });
})

app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/event', eventRoutes);
app.use('/feedback', feedbackRoutes);
app.use('/volunteer', volunteerRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });

  return;
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

