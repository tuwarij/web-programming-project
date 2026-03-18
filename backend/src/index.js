require('dotenv').config();
const express = require('express');
const cors = require('cors');

const foodRoutes = require('./routes/food.routes');
const workoutRoutes = require('./routes/workout.routes');
const weightRoutes = require('./routes/weight.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://web-programming-project-h9fh.vercel.app'
  ]
}));

app.use(express.json());

app.use('/api/food', foodRoutes);
app.use('/api/workout', workoutRoutes);
app.use('/api/weight', weightRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (res) => res.json({ status: 'OK' }));

app.use((err, res) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));