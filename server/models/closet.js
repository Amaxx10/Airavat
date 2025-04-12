import mongoose from 'mongoose';

const closetSchema = new mongoose.Schema({
  dress_id: {
    type: Number,
    unique: true
  },
  image: {
    type: String, // stores Base64 encoded image
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  dress_type: {
    type: String,
    enum: ['upper garment', 'lower garment'],
    required: true
  }
}, {
  timestamps: true
});

// Auto-increment dress_id
closetSchema.pre('save', async function(next) {
  if (this.isNew) {
    const lastDress = await this.constructor.findOne({}, {}, { sort: { 'dress_id': -1 } });
    this.dress_id = lastDress ? lastDress.dress_id + 1 : 1;
  }
  next();
});

export const Closet = mongoose.model('Closet', closetSchema);
