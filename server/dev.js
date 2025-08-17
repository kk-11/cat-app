import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Start Vite dev server
const vite = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    FORCE_COLOR: '1',
  },
});

// Start Express server with nodemon
const server = spawn('npm', ['run', 'dev:server'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    NODE_ENV: 'development',
    PORT: '3001',
    FORCE_COLOR: '1',
  },
});

// Handle process exit
const handleExit = () => {
  vite.kill();
  server.kill();
  process.exit();
};

process.on('SIGINT', handleExit);
process.on('SIGTERM', handleExit);
process.on('exit', handleExit);

console.log('🚀 Development servers starting...');
console.log('Frontend: http://localhost:3000');
console.log('Backend API: http://localhost:3001');
