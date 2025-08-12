import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/Users';

export const registerUser = async (req: Request, res: Response) => {

  const { username, password, name, email, phone, role } = req.body;

  try {
   
    if (!username || !password || !name) {
      return res.status(400).json({ message: 'Lütfen kullanıcı adı, şifre ve isim alanlarını doldurun.' });
    }

  
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Bu kullanıcı adı zaten alınmış." });
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
      role, // rol sağlanmazsa rol varsayılan 'kullanıcı'yı kullanacaktır
    });

    if (user) {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        throw new Error("JWT_SECRET tanımlanmamış!");
        throw new Error("JWT_SECRET tanımlanmamış!");
      }

      
      const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
        expiresIn: '1h',
      });

     
      res.status(201).json({
        message: "Kayıt başarılı!",
        message: "Kayıt başarılı!",
        token: token,
        user: {
          id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } else {
      res.status(400).json({ message: "Geçersiz kullanıcı verisi." });
      res.status(400).json({ message: "Geçersiz kullanıcı verisi." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  console.log('Kullanıcı adı:', username);
  console.log('Şifre:', password);

  if (!username || !password) {
    return res.status(400).json({ message: 'Lütfen kullanıcı adı ve şifre girin.' });
  }

  try {
    const user = await User.findOne({ username }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre.' });
    }

    const isMatch = await bcrypt.compare(password, user.password!);

    if (isMatch) {
      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        console.error('JWT_SECRET tanımlanmamış!');
        return res.status(500).json({ message: 'Sunucu yapılandırma hatası.' });
      }

      const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, {
        expiresIn: '1h',
      });

      return res.status(200).json({
        success: true,
        message: 'Giriş başarılı!',
        user: {
          id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
        token: token,
      });
    }
    else {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre.' });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Sunucu hatası oluştu.' });
  }
};

export const getAdminProfile = async (req: Request, res: Response) => {
  res.status(200).json({ message: 'Admin profil sayfası' });
};

// Admin tarafından kullanıcı kaydı
export const adminRegisterUser = async (req: Request, res: Response) => {
  const { username, password, name, email, phone, role, department, workShift, notes, isActive } = req.body;

  try {
    // Gerekli alanları kontrol et
    if (!username || !password || !name) {
      return res.status(400).json({ 
        message: 'Lütfen kullanıcı adı, şifre ve isim alanlarını doldurun.',
        success: false 
      });
    }

    // Kullanıcı adı zaten var mı kontrol et
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ 
        message: 'Bu kullanıcı adı zaten alınmış.',
        success: false 
      });
    }

    // Email varsa ve zaten kullanılıyorsa kontrol et
    if (email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ 
          message: 'Bu email adresi zaten kullanılıyor.',
          success: false 
        });
      }
    }

    // Şifreyi hashle
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Yeni kullanıcı oluştur
    const user = await User.create({
      username,
      password: hashedPassword,
      name,
      email: email || undefined,
      phone: phone || undefined,
      role: role || 'user', // Varsayılan rol 'user'
      department: department || undefined,
      workShift: workShift || undefined,
      notes: notes || undefined,
      isActive: isActive !== undefined ? isActive : true, // Varsayılan aktif
    });

    if (user) {
      res.status(201).json({
        message: 'Kullanıcı başarıyla oluşturuldu!',
        success: true,
        user: {
          id: user._id,
          username: user.username,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          department: user.department,
          workShift: user.workShift,
          notes: user.notes,
          isActive: user.isActive,
          createdAt: user.createdAt || new Date(),
        },
      });
    } else {
      res.status(400).json({ 
        message: 'Kullanıcı oluşturulamadı.',
        success: false 
      });
    }
  } catch (error) {
    console.error('Admin kullanıcı kayıt hatası:', error);
    res.status(500).json({ 
      message: 'Sunucu hatası oluştu.',
      success: false 
    });
  }
};

// Tüm kullanıcıları listele (Admin için)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    
    res.status(200).json({
      message: 'Kullanıcılar başarıyla getirildi.',
      success: true,
      users: users,
      count: users.length
    });
  } catch (error) {
    console.error('Kullanıcıları getirme hatası:', error);
    res.status(500).json({ 
      message: 'Sunucu hatası oluştu.',
      success: false 
    });
  }
};

// Tek kullanıcı getir (Admin için)
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        message: 'Kullanıcı bulunamadı.',
        success: false
      });
    }
    
    res.status(200).json({
      message: 'Kullanıcı başarıyla getirildi.',
      success: true,
      user: user
    });
  } catch (error) {
    console.error('Kullanıcı getirme hatası:', error);
    res.status(500).json({ 
      message: 'Sunucu hatası oluştu.',
      success: false 
    });
  }
};

// Kullanıcı güncelle (Admin için)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, name, email, phone, role, department, workShift, notes, isActive } = req.body;
    
    // Kullanıcı var mı kontrol et
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({
        message: 'Kullanıcı bulunamadı.',
        success: false
      });
    }
    
    // Eğer username değiştiriliyorsa, başka kullanıcıda aynı username var mı kontrol et
    if (username && username !== existingUser.username) {
      const usernameExists = await User.findOne({ username, _id: { $ne: id } });
      if (usernameExists) {
        return res.status(400).json({
          message: 'Bu kullanıcı adı zaten kullanılıyor.',
          success: false
        });
      }
    }
    
    // Email kontrolü
    if (email && email !== existingUser.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: id } });
      if (emailExists) {
        return res.status(400).json({
          message: 'Bu email adresi zaten kullanılıyor.',
          success: false
        });
      }
    }
    
    // Kullanıcıyı güncelle
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        username: username || existingUser.username,
        name: name || existingUser.name,
        email: email || existingUser.email,
        phone: phone || existingUser.phone,
        role: role || existingUser.role,
        department: department !== undefined ? department : existingUser.department,
        workShift: workShift !== undefined ? workShift : existingUser.workShift,
        notes: notes !== undefined ? notes : existingUser.notes,
        isActive: isActive !== undefined ? isActive : existingUser.isActive,
      },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.status(200).json({
      message: 'Kullanıcı başarıyla güncellendi.',
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Kullanıcı güncelleme hatası:', error);
    res.status(500).json({ 
      message: 'Sunucu hatası oluştu.',
      success: false 
    });
  }
};

// Kullanıcı sil (Admin için)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: 'Kullanıcı bulunamadı.',
        success: false
      });
    }
    
    await User.findByIdAndDelete(id);
    
    res.status(200).json({
      message: 'Kullanıcı başarıyla silindi.',
      success: true
    });
  } catch (error) {
    console.error('Kullanıcı silme hatası:', error);
    res.status(500).json({ 
      message: 'Sunucu hatası oluştu.',
      success: false 
    });
  }
};

// Kullanıcı durumunu değiştir (Aktif/Pasif)
export const toggleUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: 'Kullanıcı bulunamadı.',
        success: false
      });
    }
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isActive: !user.isActive },
      { new: true }
    ).select('-password');
    
    res.status(200).json({
      message: `Kullanıcı ${updatedUser?.isActive ? 'aktif' : 'pasif'} duruma getirildi.`,
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Kullanıcı durum değiştirme hatası:', error);
    res.status(500).json({ 
      message: 'Sunucu hatası oluştu.',
      success: false 
    });
  }
};
