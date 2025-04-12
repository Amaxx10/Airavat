import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const get_query = async (req, res) => {
    try {
        // Log incoming request
        console.log('Received request with image data');

        if (!req.body || !req.body.image) {
            console.error('No image data in request');
            return res.status(400).json({ message: 'No image data provided' });
        }

        const flaskUrl = process.env.FLASK_URL || 'http://localhost:5000';
        console.log(`Sending request to Flask server at ${flaskUrl}`);

        const response = await axios.post(`${flaskUrl}/api/get_query`, 
            { image: req.body.image },
            {
                headers: { 
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Response from Flask server:', response.data);
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

export const get_product_links = async (req, res) => {
    try {
        const response = await axios.post(`${flaskUrl}/api/get_product_links`, 
            { query: 'Black Tshirt' },
            {
                headers: { 
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('Response from Flask server:', response.data);
        return res.status(200).json(response.data);

    } catch (error) {
        console.error('Error in get_product_links:', error.message);
        if (error.response) {
            console.error('Flask server response:', {
                data: error.response.data,
                status: error.response.status
            });
        }
        return res.status(500).json({ 
            message: 'Error processing',
            error: error.message 
        });
    }
}