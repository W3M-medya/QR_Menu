import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const protect = (req: Request, res: Response, next: NextFunction) => {
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
      
			// Kullanıcı ID veya rol gibi bilgileri req.user'a ekleyebilirsiniz
			// req.user = { id: decoded.id, role: decoded.role };
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
//TODO son model değişiklikleri yapıldıktan sonra auth middleware'i tekrar gözden geçirilmeli ve güncellenmeli.