import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  logo: {
    type: String,
    required: true,
  },
  siteName: {
    type: String,
    required: true,
  },
  siteDescription: {
    type: String,
    required: true,
  },

  contactEmail: {
    type: String,
    required: true,
  },
  contactPhone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  socialLinks: {
    facebook: { type: String, required: false },
    twitter: { type: String, required: false },
    instagram: { type: String, required: false },
    linkedin: { type: String, required: false },
  },
  secondContactPhone: {
    type: String,
    required: false,
  },
  onlineOrderEnabled: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("Settings", SettingsSchema);
