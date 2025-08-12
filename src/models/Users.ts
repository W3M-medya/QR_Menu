import mongoose, { Schema, Document } from 'mongoose';

import { IUser } from '../type/userType';

const UserSchema: Schema<IUser> = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  email: {
    type: String,
    required: false,
    unique: false,
    sparse: true, // null değerler için unique constraint'i atla
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: false,
    trim: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin', 'waiter'],
    //user -> kullanıcı
    //admin -> yönetici
    //superadmin -> yazılımcı
    //waiter -> garson
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
    // Kullanıcının aktif olup olmadığını belirler
  },
  lastLogin: {
    type: Date,
    // Son giriş tarihi
  },
  profileImage: {
    type: String,
    // Profil resmi URL'i
  },
  department: {
    type: String,
    // Çalışan departmanı (garsonlar için)
  },
  workShift: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'night'],
    // Çalışma vardiyası
  },
  notes: {
    type: String,
    maxlength: 500,
    // Admin notları
  },
}, {
  timestamps: true, // createdAt ve updatedAt alanlarını otomatik ekler
});

export default mongoose.model<IUser>('User', UserSchema);