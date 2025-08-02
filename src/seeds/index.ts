import mongoose from "mongoose";
import connectDB from "../config/db";
import { seedSettings } from "./settingsSeed";
import { seedUser } from "./userSeed";

const runAllSeeds = async () => {
  try {
    console.log("🌱 Tüm seed işlemleri başlatılıyor...");

    // Veritabanına bağlan
    await connectDB();

    // Tüm seed'leri sırayla çalıştır
    console.log("\n1️⃣ Settings seed'i çalıştırılıyor...");
    await seedSettings();

    console.log("\n2️⃣ User seed'i çalıştırılıyor...");
    await seedUser();

    console.log("\n✅ Tüm seed işlemleri başarıyla tamamlandı!");
  } catch (error) {
    console.error("❌ Seed işlemi sırasında hata:", error);
  } finally {
    // Bağlantıyı kapat
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Eğer dosya doğrudan çalıştırılırsa tüm seed'leri başlat
if (require.main === module) {
  runAllSeeds();
}

export { runAllSeeds };
