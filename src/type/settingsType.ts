export interface Isettings {
  logo: string;
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  secondContactPhone?: string;
  onlineOrderEnabled?: boolean;
}
export interface ISettingsUpdate {
  logo?: string;
  siteName?: string;
  siteDescription?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  secondContactPhone?: string;
  onlineOrderEnabled?: boolean;
}