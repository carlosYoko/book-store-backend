import express from 'express';
import { Book } from '../models/bookModel.js';

const router = express.Router();

// Ruta para guardar un nuevo libro
router.post('/', async (req, res) => {
  try {
    const { title, author, publishYear } = req.body;
    if (!title || !author || !publishYear) {
      return res
        .status(400)
        .send({ message: 'Se requieren rellenar todos los campos.' });
    }
    const newBook = {
      title,
      author,
      publishYear,
    };
    const book = await Book.create(newBook);
    return res.status(201).send(book);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Ruta para obtener todos los libros
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    const { ordenar } = req.query;

    // endpoint => /api/books?ordenar=fecha
    if (ordenar === 'year') {
      const orderedBooks = books.sort((a, b) => b.publishYear - a.publishYear);
      return res.status(201).json({
        count: books.length,
        data: orderedBooks,
      });
      // endpoint => /api/books?ordenar=titulo
    } else if (ordenar === 'title') {
      const orderedBooks = books.sort((a, b) => a.title.localeCompare(b.title));
      return res.status(201).json({
        count: books.length,
        data: orderedBooks,
      });
    } else if (ordenar === 'author') {
      const orderedBooks = books.sort((a, b) =>
        a.author.localeCompare(b.author)
      );
      return res.status(201).json({
        count: books.length,
        data: orderedBooks,
      });
    }

    return res.status(201).json({
      count: books.length,
      data: books.reverse(),
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: error.message });
  }
});

// Ruta para obtner un libro a traves del ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) {
      return res.status(500).send('Error al obtener el libro');
    }
    return res.status(200).json(book);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Ruta para actualizar un libro
router.put('/:id', async (req, res) => {
  try {
    const { title, author, publishYear } = req.body;
    if (!title || !author || !publishYear) {
      return res
        .status(400)
        .send({ message: 'Todos los campos son obligatorios' });
    }
    const { id } = req.params;
    const result = await Book.findByIdAndUpdate(id, req.body);
    if (!result) {
      return res.status(400).json({ message: 'Libro no encontrado' });
    }
    return res.status(200).send({ message: 'Libro actualizado!' });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Ruta para eliminar un libro
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Book.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Libro no encontrado' });
    }
    return res.status(200).json({ message: 'Libro eliminado correctamente' });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

export default router;
