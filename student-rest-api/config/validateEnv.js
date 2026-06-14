const required = [
  'JWT_ENCRYPTION',
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
];

module.exports = function validateEnv() {
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing.join(', '));
    console.error('Copy example.env to .env and fill in all values.');
    process.exit(1);
  }
};
