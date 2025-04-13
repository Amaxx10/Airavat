import mongoose from 'mongoose';

const feedImageSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

export const FeedImage = mongoose.model('FeedImage', feedImageSchema);