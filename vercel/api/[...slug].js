import { createApp } from '../../server/app.js';

// Create Express app instance for Vercel
let app;

try {
  app = createApp();
  console.log('✅ Express app created successfully with database connection');
} catch (error) {
  console.error('❌ Failed to create Express app with database:', error);
  // Fallback for cases where database or other dependencies are not available
  const express = (await import('express')).default;
  app = express();

  app.use(express.json());

  console.log('⚠️ Using fallback mock API - connect Supabase for real functionality');

  // Health check
  app.get('/health', (req, res) => {
    res.json({
      ok: true,
      message: 'Server running without database connection - using mock API',
      timestamp: new Date().toISOString()
    });
  });

  // API routes with mock responses
  app.use('/api', (req, res) => {
    const path = req.path;
    console.log(`📡 Mock API request: ${req.method} ${path}`);

    if (path.includes('/types') || path.includes('/type')) {
      return res.json({
        success: true,
        data: [
          { id: 1, name: 'smartphone' },
          { id: 2, name: 'laptop' },
          { id: 3, name: 'tablet' }
        ],
        message: 'Mock data - connect Supabase for real functionality'
      });
    }
    if (path.includes('/brands') || path.includes('/brand')) {
      return res.json({
        success: true,
        data: [
          { id: 1, name: 'Apple' },
          { id: 2, name: 'Samsung' },
          { id: 3, name: 'Lenovo' }
        ],
        message: 'Mock data - connect Supabase for real functionality'
      });
    }
    if (path.includes('/devices') || path.includes('/device')) {
      return res.json({
        success: true,
        data: {
          rows: [
            {
              id: 1,
              name: 'iPhone 15',
              price: 999,
              brandId: 1,
              typeId: 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ],
          count: 1
        },
        message: 'Mock data - connect Supabase for real functionality'
      });
    }
    if (path.includes('/user/auth')) {
      return res.status(401).json({
        message: 'Not authenticated. Connect to Supabase and run migrations.'
      });
    }
    res.status(404).json({
      error: 'API endpoint not found',
      path: req.path,
      message: 'Mock API - connect Supabase for full functionality'
    });
  });
}

export default function handler(req, res) {
  return new Promise((resolve, reject) => {
    app(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
