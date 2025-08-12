import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import connectDB from './config/db';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';

dotenv.config();

connectDB();

const app = express();

app.use(cors()); // CORS middleware'ini ekle
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

export default app;