import jwt from 'jsonwebtoken';

const generateToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'devsecret', {
    expiresIn: '30d'
  });
};

export default generateToken; 