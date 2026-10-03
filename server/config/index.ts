import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  jwtSecret: process.env.JWT_SECRET || 'bca_ai_ad_generator_secret_key_2026',
  jwtExpiresIn: '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  mongoUri: process.env.MONGODB_URI || '',
  dataDir: './data',
};
