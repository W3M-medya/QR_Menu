import mongoose from "mongoose";
import Settings from "../models/Settings";
import connectDB from "../config/db";

const seedSettings = async () => {
  try {
    // Mevcut settings verilerini kontrol et
    const existingSettings = await Settings.findOne();
    
    if (existingSettings) {
      console.log("⚠️  Settings verileri zaten mevcut!");
      return;
    }

    // Örnek settings verisi
    const defaultSettings = new Settings({
      _id: new mongoose.Types.ObjectId("111111111111111111111111"), // Geçerli 24 karakter ObjectId
      logo: "https://via.placeholder.com/200x100?text=LOGO",
      siteName: "QR Menü Restoranı",
      siteDescription: "Modern ve lezzetli yemeklerimizi keşfedin",
      contactEmail: "info@qrmenu.com",
      contactPhone: "+90 555 123 45 67",
      address: "İstanbul, Türkiye - Örnek Mahalle, Örnek Sokak No:1",
      socialLinks: {
        facebook: "https://facebook.com/qrmenu",
        twitter: "https://twitter.com/qrmenu",
        instagram: "https://instagram.com/qrmenu",
        linkedin: "https://linkedin.com/company/qrmenu",
      },
      secondContactPhone: "+90 555 765 43 21",
      onlineOrderEnabled: true,
    });

    // Veritabanına kaydet
    await defaultSettings.save();
    
    console.log("✅ Settings verileri başarıyla eklendi!");
    console.log("📄 Eklenen veriler:", defaultSettings);
    
  } catch (error) {
    console.error("❌ Settings seed işlemi sırasında hata:", error);
    throw error;
  }
};

// Eğer dosya doğrudan çalıştırılırsa seed'i başlat
if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      await seedSettings();
    } catch (error) {
      console.error("❌ Seed işlemi başarısız:", error);
    } finally {
      await mongoose.connection.close();
      process.exit(0);
    }
  })();
}

export { seedSettings };
