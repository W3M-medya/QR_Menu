import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      const token = authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Yetkilendirme hatası, token formatı yanlış.' });
      }
      
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('Sunucu yapılandırma hatası: JWT_SECRET tanımlanmamış.');
      }
      
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
      
      // Kullanıcıyı veritabanından al
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'Kullanıcı bulunamadı.' });
      }
      
      req.user = user;
      console.log('Token doğrulandı, kullanıcı ID:', decoded.id);
      
      next();

    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Yetkisiz erişim veya geçersiz token.' });
    }
  } else {
    return res.status(401).json({ message: 'Yetkisiz erişim, Bearer token bulunamadı.' });
  }
};