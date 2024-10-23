import jwt from 'jsonwebtoken';

export const verifyToken = (req) => {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Unauthorized: No token provided');
    }
  
    const token = authHeader.split(' ')[1];
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      return user; // Return the decoded user data
    } catch (err) {
      throw new Error('Invalid token'); // Error thrown if token is invalid
    }
  };
  