const fs = require('fs');
const path = require('path');

const blacklistPath = path.join(
  __dirname,
  '..',
  'node_modules',
  'metro-config',
  'src',
  'defaults',
  'blacklist.js',
);

if (!fs.existsSync(blacklistPath)) {
  process.exit(0);
}

const broken = 'return pattern.source.replace(/\\//g, path.sep);';
const fixed = 'return pattern.source.replace(/\\//g, "\\\\" + path.sep);';
const source = fs.readFileSync(blacklistPath, 'utf8');

if (source.indexOf(fixed) !== -1) {
  process.exit(0);
}

if (source.indexOf(broken) === -1) {
  console.warn(
    'Metro blacklist patch was not applied: expected code was not found.',
  );
  process.exit(0);
}

fs.writeFileSync(blacklistPath, source.replace(broken, fixed));
console.log('Patched Metro blacklist for Windows.');

// --- Shim para @react-native-community/toolbar-android ---
// react-native-vector-icons v6 importa esse módulo opcionalmente.
// Criamos um stub vazio para evitar erro de bundling.
const toolbarDir = path.join(
  __dirname, '..', 'node_modules', '@react-native-community', 'toolbar-android',
);
if (!fs.existsSync(toolbarDir)) {
  fs.mkdirSync(toolbarDir, {recursive: true});
}
const toolbarIndex = path.join(toolbarDir, 'index.js');
if (!fs.existsSync(toolbarIndex)) {
  fs.writeFileSync(toolbarIndex, 'module.exports = {};');
  fs.writeFileSync(
    path.join(toolbarDir, 'package.json'),
    JSON.stringify({name: '@react-native-community/toolbar-android', version: '0.0.0', main: 'index.js'}),
  );
  console.log('Created toolbar-android shim for react-native-vector-icons.');
}
