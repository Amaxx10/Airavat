import mongoose from "mongoose";

const GeneratedSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
});

export const Generated = mongoose.model("Generated", GeneratedSchema);
