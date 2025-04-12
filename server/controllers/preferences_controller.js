import { UserPreferences } from '../models/user_preferences.js';

export const savePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;
    
    // Get the first document or create if none exists
    const existingPrefs = await UserPreferences.findOne();
    
    if (existingPrefs) {
      const updated = await UserPreferences.findByIdAndUpdate(
        existingPrefs._id, 
        preferences,
        { new: true }
      );
      return res.json(updated);
    }

    const newPreferences = new UserPreferences(preferences);
    await newPreferences.save();
    res.status(201).json(newPreferences);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPreferences = async (req, res) => {
  try {
    const preferences = await UserPreferences.findOne();
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
