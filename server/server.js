import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/connectdb.js';
import dotenv from 'dotenv';
import query_routes from './routes/query_routes.js';

const port = process.env.PORT || 3000;
const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/query',query_routes);

// TEST:

import multer from 'multer';
import { Closet } from './models/closet.js';

const upload = multer();

// receive image and save to database
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: 'No image uploaded' });
    }

    const imageBuffer = req.file.buffer;
    const base64Image = imageBuffer.toString('base64');

    const newDress = new Closet({
      image: base64Image,
      description: req.body.description || '',
      dress_type: req.body.dress_type || 'upper garment'
    });

    await newDress.save();
    res.status(201).send({ 
      message: 'Image uploaded and saved successfully',
      dress: newDress 
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// get image by dress_id
app.get('/image/:dress_id', async (req, res) => {
  try {
    const dress = await Closet.findOne({ dress_id: req.params.dress_id });
    if (!dress) {
      return res.status(404).send('Image not found');
    }
    res.send({ image: dress.image });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// TEST END  

app.listen(port, async () => {
    try {
        await connectDB();
        console.log(`Server running at http://localhost:${port}`);
    } catch (err) {
        console.error("Error starting server:", err.message);
    }
});
