export interface IUser {
  username: string;
  password?: string;
  name: string;
  email?: string;
  phone?: string;
  role: "user" | "admin" | "superadmin" | "waiter";
  isActive?: boolean;
  lastLogin?: Date;
  profileImage?: string;
  department?: string;
  workShift?: "morning" | "afternoon" | "evening" | "night";
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
