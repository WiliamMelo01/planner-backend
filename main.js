import 'dotenv/config';
import express from 'express';
import userRoutes from './controllers/user-controller.js';
import authRoutes from './controllers/auth-controller.js';
import taskRoutes from './controllers/task-controller.js';
import columnRoutes from './controllers/column-controller.js';
import cors from "cors";

const app = express();

const PORT =  process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/api/v1/users', userRoutes);

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/tasks', taskRoutes);

app.use('/api/v1/columns', columnRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
