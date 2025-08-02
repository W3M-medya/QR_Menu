export interface IUser {
  username: string;
  password?: string;
  name: string;
  email?: string;
  phone?: string;
  role: "user" | "admin" | "superadmin" | "waiter";
}
