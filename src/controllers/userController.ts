import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/Users";

export const registerUser = async (req: Request, res: Response) => {
  const { username, password, name, email, phone, role } = req.body;
  try {
    if (!username || !password || !name) {
      return res.status(400).json({
        message:
          "Lütfen tüm zorunlu alanları doldurun (kullanıcı adı, şifre, isim).",
      });
    }

    const userExists = await User.findOne({ username });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Bu kullanıcı adı zaten alınmış." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      password: hashedPassword,
      name,
      email,
      phone,
      role,
    });

    if (user) {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT_SECRET tanımlanmamış!");
      }

      const token = jwt.sign({ id: user._id }, jwtSecret, {
        expiresIn: "1h",
      });

      res.status(201).json({
        message: "Kayıt başarılı!",
        token: token,
        user: {
          id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } else {
      res.status(400).json({ message: "Geçersiz kullanıcı verisi." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Sunucu hatası oluştu." });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const jwtSecret = process.env.JWT_SECRET;
  try {
    if (!jwtSecret) {
      throw new Error("JWT_SECRET tanımlanmamış!");
    }
    const user = await User.findOne({ username }).select("+password");

    // Admin login
    if (username === process.env.ADMIN_USERNAME) {
      if (password === process.env.ADMIN_PASSWORD) {
        // Eğer veritabanında admin user yoksa, default admin bilgileriyle dön
        const adminUser = user || {
          _id: 'admin',
          username: process.env.ADMIN_USERNAME,
          name: 'Admin',
          email: process.env.ADMIN_EMAIL || '',
          phone: '',
          role: 'admin',
        };
        const token = jwt.sign({ id: adminUser._id }, jwtSecret, {
          expiresIn: "12h",
        });
        return res.status(200).json({
          success: true,
          message: "Giriş başarılı!",
          token: token,
          user: {
            id: adminUser._id,
            username: adminUser.username,
            name: adminUser.name,
            email: adminUser.email,
            phone: adminUser.phone,
            role: adminUser.role,
          },
        });
      } else {
        return res.status(401).json({success:false, message: "Hatalı giriş yaptınız" });
      }
    }

    // Normal kullanıcı login
    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
      const token = jwt.sign({ id: user._id }, jwtSecret, {
        expiresIn: "12h",
      });
      res.status(200).json({
        success: true,
        message: "Giriş başarılı!",
        token: token,
        user: {
          id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({ success: false, message: "Geçersiz kullanıcı adı veya şifre." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Sunucu hatası oluştu." });
  }
};

export const getAdminProfile = (req: Request, res: Response) => {
  res.status(200).json({
    message: "Merhaba Admin! Bu korumalı bir alandır.",
  });
};
