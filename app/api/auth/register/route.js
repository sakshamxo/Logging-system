import bcrypt from 'bcrypt';
import User from '../../../../models/User';
import { generateToken } from '../../../../config/jwt';
import connectDB from '../../../../config/database';

export async function POST(req) {
    await connectDB();
    const { username, email, password, role } = await req.json(); // Include email in destructuring
  
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Create the new user
      const user = await User.create({ username, email, password: hashedPassword, role });
      
      // Generate a token for the new user
      const token = generateToken(user);
  
      return new Response(JSON.stringify({ token, user }), { status: 201 });
    } catch (error) {
      console.error('Error during registration:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
    }
}
