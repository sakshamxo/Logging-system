import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'], // Basic email validation
  },  
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: 'user', // Set default role if needed
  },
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

export default mongoose.models.User || mongoose.model('User', UserSchema);
