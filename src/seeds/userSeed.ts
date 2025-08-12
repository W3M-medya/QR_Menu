import mongoose from "mongoose";
import User from "../models/Users";
import connectDB from "../config/db";

const seedUser = async () => {
  try {
    // Mevcut user verilerini kontrol et
    const existingUser = await User.findOne();

    if (existingUser) {
      console.log("⚠️  User verileri zaten mevcut!");
      return;
    }

    // Örnek user verisi
    const defaultUser = new User({
      _id: new mongoose.Types.ObjectId("222222222222222222222222"), // Geçerli 24 karakter ObjectId
      username: process.env.ADMIN_USERNAME || "admin",
      password: process.env.ADMIN_PASSWORD || "admin1234",
      name: process.env.ADMIN_NAME || "Admin User",
      email: process.env.ADMIN_EMAIL || "admin@qrmenu.com",
      phone: process.env.ADMIN_PHONE || "+90 555 123 45 67",
      role: "admin",
    });

    // Veritabanına kaydet
    await defaultUser.save();

    console.log("✅ User verileri başarıyla eklendi!");
    console.log("📄 Eklenen veriler:", defaultUser);
  } catch (error) {
    console.error("❌ User seed işlemi sırasında hata:", error);
    throw error;
  }
};

// Eğer dosya doğrudan çalıştırılırsa seed'i başlat
if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      await seedUser();
    } catch (error) {
      console.error("❌ User seed işlemi başarısız:", error);
    } finally {
      await mongoose.connection.close();
      process.exit(0);
    }
  })();
}

export { seedUser };
