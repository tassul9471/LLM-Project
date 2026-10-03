import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './server/config/index.js';
import healthRoutes from './server/routes/healthRoutes.js';
import authRoutes from './server/routes/authRoutes.js';
import productRoutes from './server/routes/productRoutes.js';
import adRoutes from './server/routes/adRoutes.js';
import adminRoutes from './server/routes/adminRoutes.js';
import { errorHandler, notFoundHandler } from './server/middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = config.port;

  // Body parser middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // API Routes
  app.use('/api/health', healthRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/ads', adRoutes);
  app.use('/api/admin', adminRoutes);

  // Development vs Production
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Dynamic import of Vite in development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // Serve static build in production
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));

    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api/')) {
        return next();
      }
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  // Handle unmatched API routes
  app.all('/api/*', notFoundHandler);

  // Global Error Handler
  app.use(errorHandler);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AI Ad Generator] Server running on http://0.0.0.0:${PORT}`);
    console.log(`[AI Ad Generator] Mode: ${isProd ? 'Production' : 'Development'}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
