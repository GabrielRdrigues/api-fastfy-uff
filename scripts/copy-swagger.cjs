const { copyFileSync, mkdirSync } = require('node:fs');
const path = require('node:path');

const destination = path.resolve(__dirname, '../dist/src/main/config');
mkdirSync(destination, { recursive: true });
copyFileSync(
  path.resolve(__dirname, '../src/main/config/swagger-output.json'),
  path.join(destination, 'swagger-output.json'),
);
