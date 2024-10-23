import bcrypt from 'bcrypt';
import User from '../../../../models/User';
import { generateToken } from '../../../../config/jwt'; // Import your generateToken function
import connectDB from '../../../../config/database';

import Log from '../../../../models/Log'; // Import your log model

export async function POST(req) {
    await connectDB();
   
    const { email, password } = await req.json();
   
    try {
        const user = await User.findOne({ email });
        console.log(user);
      
        if (!user) {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
        }
  
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch);
        
        if (!isMatch) {
            return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
        }
  
        // Create JWT token using generateToken
        const token = generateToken(user);
        console.log(token);
        
        // Log the successful login action
        await Log.create({
            actionType: 'LOGIN',
            userId: user._id,
            role: user.role,
            additionalData: { email }, // Add more data if necessary
        });

        return new Response(JSON.stringify({ token }), { status: 200 });
    } catch (error) {
        console.error('Error during login:', error);
        return new Response(JSON.stringify({ error: 'Login failed' }), { status: 500 });
    }
}