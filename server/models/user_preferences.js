import mongoose from 'mongoose';

const userPreferencesSchema = new mongoose.Schema({
  gender: {
    type: String,
    enum: ['male', 'female', 'non-binary', 'prefer-not-to-say'],
    required: true
  },
  skinTone: {
    type: String,
    enum: ['fair', 'light', 'medium', 'olive', 'brown', 'dark'],
    required: true
  },
  bodyShape: {
    type: String,
    enum: ['lean', 'athletic', 'muscular', 'plus-size', 'petite', 'average'],
    required: true
  },
  stylePreferences: [{
    type: String,
    enum: ['baggy', 'athletic', 'sporty', 'professional', 'old-money', 'minimalist', 'streetwear', 'bohemian', 'vintage']
  }],
  colorPreferences: [{
    type: String
  }]
}, {
  timestamps: true
});

export const UserPreferences = mongoose.model('UserPreferences', userPreferencesSchema);
