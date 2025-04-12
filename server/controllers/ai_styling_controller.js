import axios from 'axios';
import dotenv from 'dotenv';
import {Closet} from '../models/closet.js';
import {UserPreferences} from '../models/user_preferences.js';
dotenv.config();

const flaskUrl = process.env.FLASK_URL;

export const get_aiStyling = async (req, res) => {
  try {
    // Get user preferences from database - fetch first document
    const userPreferences = await UserPreferences.findOne().lean();

    console.log(userPreferences)

    if (!userPreferences) {
      return res.status(404).json({ message: 'Preferences not found' });
    }

    // Get AI styling suggestion from Flask
    const response = await axios.post(`${flaskUrl}/api/ai-styling`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log(response.data)

    const { upper_garment_id, lower_garment_id } = response.data;

    // Fetch the actual clothing items from MongoDB
    const [upperGarment, lowerGarment] = await Promise.all([
      Closet.findOne({ dress_id: upper_garment_id }),
      Closet.findOne({ dress_id: lower_garment_id })
    ]);

    if (!upperGarment || !lowerGarment) {
      return res.status(404).json({ 
        message: 'One or more suggested clothing items not found in closet.'
      });
    }

    // Format and return the response
    res.status(200).json({
      message: 'AI styling completed successfully.',
      suggestion: {
        upper_garment: {
          id: upperGarment.dress_id,
          image: upperGarment.image,
          description: upperGarment.description,
          type: upperGarment.dress_type
        },
        lower_garment: {
          id: lowerGarment.dress_id,
          image: lowerGarment.image,
          description: lowerGarment.description,
          type: lowerGarment.dress_type
        }
      }
    });
  } catch (error) {
    console.error('Error in AI styling:', error);
    res.status(500).json({ 
      message: 'Internal server error.',
      error: error.message 
    });
  }
};