const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Technology', 'Health', 'Lifestyle', 'Education', 'Travel'],
    message: 'Category must be one of the predefined categories',
  },
  description:{
    type: String,
    required: true,
  },
  creator:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'userModel',
    required: true
  },
  thumbnail: {
    type: String,
    required: true,
  },
}, {
  timestamps: true
});

const postModel = mongoose.model('post', postSchema);
module.exports = {postModel};