import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    default: 'Other',
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public',
  },
  tags:[{
    type: String
  }],
  content: {
    type: String,
    required: true, 
  },
  username: {
    type: String,
    required: true,
    index: true,
  },
  likes_count: {
    type: Number,
    default: 0,
    min: 0,
  },
  likes: [{
    type: String
  }],
  saves: [{
    type: String
  }],
  created_at: {
    type: Date,
    default: Date.now, 
  },
});

const Post = mongoose.model('Post', postSchema);

export default Post;