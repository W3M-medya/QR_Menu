import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user';

export const registerUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Lütfen tüm alanları doldurun.' });
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'Bu kullanıcı adı zaten alınmış.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      password: hashedPassword,
    });

    if (user) {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET tanımlanmamış!');
      }

      const token = jwt.sign({ id: user._id }, jwtSecret, {
        expiresIn: '1h',
      });

      res.status(201).json({
        message: 'Kayıt başarılı!',
        token: token,
        user: {
          id: user._id,
          username: user.username,
        },
      });
    } else {
      res.status(400).json({ message: 'Geçersiz kullanıcı verisi.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
        return res.status(400).json({ message: 'Lütfen kullanıcı adı ve şifre girin.' });
    }

    const user = await User.findOne({ username }).select('+password');

    if (user && (await bcrypt.compare(password, user.password!))) {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error('JWT_SECRET tanımlanmamış!');
      }

      const token = jwt.sign({ id: user._id }, jwtSecret, {
        expiresIn: '1h',
      });

      res.status(200).json({
        message: 'Giriş başarılı!',
        token: token,
      });
    } else {
      res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
};

export const getAdminProfile = (req: Request, res: Response) => {
    res.status(200).json({
        message: "Merhaba Admin! Bu korumalı bir alandır.",
    });
};