import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configure Neon to use WebSocket for firewall bypass (port 443)
neonConfig.webSocketConstructor = ws;

// Connection string is required
const connectionString = process.env.POSTGRES_URL;

// Allow toggling SSL via env (disable | require). Default: disable (safer for self-hosted)
// For cloud providers, set POSTGRES_SSL=require in .env.local
const sslMode = (process.env.POSTGRES_SSL || 'disable').toLowerCase();

const pool = new Pool({
  connectionString,
  // @neondatabase/serverless handles SSL automatically for Neon, but we can keep this if needed
  // ssl: sslMode === 'require' ? { rejectUnauthorized: false } : undefined, 
});

export default pool;
