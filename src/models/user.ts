import mongoose, { Schema, Document } from 'mongoose';

import { IUser } from '../type/userType';

const UserSchema: Schema<IUser> = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
    unique: false,
  },
  phone: {
    type: String,
    required: false,
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
});

export default mongoose.model<IUser>('User', UserSchema);