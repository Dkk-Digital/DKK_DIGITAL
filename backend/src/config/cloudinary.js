import { v2 as cloudinary } from 'cloudinary';

const hasCreds =
  process.env.CLOUDINARY_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_NAME !== 'Root';

let client;

if (hasCreds) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  client = cloudinary;
} else {
  // Fallback mock for local testing when Cloudinary creds are not provided.
  client = {
    uploader: {
      upload_stream: (opts, cb) => {
        const stream = {
          end: (buffer) => {
            setTimeout(() => cb(null, { secure_url: 'https://placehold.co/600x400', public_id: `mock_${Date.now()}` }), 10);
          },
        };
        return stream;
      },
      destroy: async (publicId) => ({ result: 'ok' }),
    },
  };
}

export default client;