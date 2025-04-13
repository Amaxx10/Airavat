import axios from 'axios';
import dotenv from 'dotenv';
import multer from 'multer';
import { FeedImage } from '../models/feed_images.js';
dotenv.config();

export const upload = multer();

export const get_query = async (req, res) => {
    try {
        // Check if file exists in request
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        // Convert image buffer to base64
        const base64Image = req.file.buffer.toString('base64');

        // Save image to feed_images collection
        const feedImage = new FeedImage({
            image: base64Image
        });
        await feedImage.save();

        const flaskUrl = process.env.FLASK_URL;
        console.log('Sending request to Flask server');

        // Send base64 image to Flask server
        const response = await axios.post(`${flaskUrl}/api/get_query`, 
            { 
                image_id: feedImage.feed_id,  // Use feed_id instead of image_id
                // image: base64Image // Send the actual image data
            },
            {
                headers: { 
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Received response from Flask server');
        return res.status(200).json(response.data);

    } catch (error) {
        console.error('Error in get_query:', error.message);
        if (error.response) {
            console.error('Flask server response:', {
                data: error.response.data,
                status: error.response.status
            });
        }
        return res.status(500).json({ 
            message: 'Error processing image',
            error: error.message 
        });
    }
};