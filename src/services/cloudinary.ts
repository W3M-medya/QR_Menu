const cloudinary = require('../config/cloudinaryConfig');

const uploadImage = async (fileBuffer: Buffer) => {
  try {
    // Buffer'ı base64'e çevir
    const base64Data = `data:image/jpeg;base64,${fileBuffer.toString('base64')}`;
    
    const result = await cloudinary.uploader.upload(base64Data, {
      folder: 'General',
      public_id: `product_${Date.now()}`, // Unique isim
    });
    
    return {
      secure_url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed');
  }
};

const deleteImage = async (publicId: string) => {
  // console.log('Deleting image with public ID:', publicId);
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error('Image deletion failed');
  }
};

export { uploadImage, deleteImage };
