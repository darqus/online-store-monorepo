import app from '../../server/app.js';

export default async function handler(req, res) {
  // Proxy all requests to the Express app
  return app(req, res);
}
