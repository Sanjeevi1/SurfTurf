const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting SurfTurf Development Environment...\n');

// Start backend server
console.log('📦 Starting Backend Server...');
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true
});

// Start frontend server
console.log('⚛️  Starting Frontend Server...');
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill();
  frontend.kill();
  process.exit();
});

backend.on('error', (err) => {
  console.error('Backend error:', err);
});

frontend.on('error', (err) => {
  console.error('Frontend error:', err);
});

console.log('\n✅ Both servers are starting...');
console.log('🌐 Frontend: http://localhost:3000');
console.log('🔧 Backend: http://localhost:5000');
console.log('\nPress Ctrl+C to stop both servers');
