import express from 'express';
import mongoose from 'mongoose';
import booksRoute from './routes/booksRoutes.js';
import cors from 'cors';
import 'dotenv/config';

const app = express();

// Middlewares
app.use(express.json());

// cors
app.use(cors());
//Opcion 2: Custom
// app.use(
// cors({
// origin: 'http://localhost:3000',
// methods: ['GET', 'POST', 'PUT', 'DELETE'],
// allowedHeaders: ['Content-Type'],
// })
// );

app.get('/', (req, res) => {
  return res.status(234).send('Welcome to API Books!!!');
});

app.use('/api/books', booksRoute);

const PORT = process.env.PORT || 5555;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('App conectada a MongoDB');
    app.listen(PORT, () =>
      console.log(`Escuchando en puerto ${PORT}...${process.env.HOLA}`)
    );
  })
  .catch((error) => console.log(error));
