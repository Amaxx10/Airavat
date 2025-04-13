import mongoose from 'mongoose';

const feedImageSchema = new mongoose.Schema({
    feed_id: {
        type: Number,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

// Auto-increment feed_id
feedImageSchema.pre('save', async function(next) {
    if (this.isNew) {
        const lastImage = await this.constructor.findOne({}, {}, { sort: { 'feed_id': -1 } });
        this.feed_id = lastImage ? lastImage.feed_id + 1 : 1;
    }
    next();
});

export const FeedImage = mongoose.model('FeedImage', feedImageSchema);