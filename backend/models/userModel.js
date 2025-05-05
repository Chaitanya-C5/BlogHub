import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 5,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 20
  },
  profilePicture: { 
    type: String,
    default: ''
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  following: {
    type: [String],
    default: [], 
  },
  followers: {
    type: [String],
    default: [], 
  },
  liked_posts: {
    type: [String],
    default: [], 
  },
  saved_posts: {
    type: [String],
    default: [], 
  }
});


UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.methods.comparePassword = async function(userPassword) {
  return bcrypt.compare(userPassword, this.password);
};

export default mongoose.model('User', UserSchema);