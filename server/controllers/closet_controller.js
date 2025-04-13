import {Closet} from '../models/closet.js';
import multer from 'multer';

export const upload = multer();

export const uploadImage = async (req, res) => {
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
};

export const get_images = async (req, res) => {
  try {
    const dresses = await Closet.find();
    if (!dresses.length) {
      return res.status(404).send('No images found');
    }
    res.send({ images: dresses.map(dress => dress.image) });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};