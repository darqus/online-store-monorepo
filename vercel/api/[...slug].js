// Vercel API Route - Universal handler for all API requests
// This catches all /api/* requests and redirects them to the appropriate handlers

export default async function handler(req, res) {
  const { slug } = req.query;
  const path = slug ? slug.join('/') : '';

  // Simple routing based on path
  if (path === 'health') {
    return res.status(200).json({ ok: true, timestamp: new Date().toISOString() });
  }

  if (path.startsWith('types') || path === 'type') {
    // Redirect to types handler
    return res.status(200).json({
      success: true,
      data: [
        { id: 1, name: 'smartphone' },
        { id: 2, name: 'laptop' },
        { id: 3, name: 'tablet' }
      ],
      message: 'This is mock data. Connect to Supabase for real data.'
    });
  }

  if (path.startsWith('brands') || path === 'brand') {
    return res.status(200).json({
      success: true,
      data: [
        { id: 1, name: 'Apple' },
        { id: 2, name: 'Samsung' },
        { id: 3, name: 'Lenovo' }
      ],
      message: 'This is mock data. Connect to Supabase for real data.'
    });
  }

  if (path.startsWith('devices') || path === 'device') {
    return res.status(200).json({
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
      message: 'This is mock data. Connect to Supabase for real data.'
    });
  }

  if (path.startsWith('user/auth')) {
    return res.status(401).json({
      message: 'Not authenticated. Please connect to Supabase and run migrations.'
    });
  }

  // Default response for unknown endpoints
  res.status(404).json({
    error: 'API endpoint not found',
    path: `/api/${path}`,
    message: 'This is a mock API. Connect your Supabase database for full functionality.'
  });
}
