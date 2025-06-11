// 检查环境变量的脚本
const fs = require('fs');
const path = require('path');

// 手动加载 .env.local 文件
function loadEnvFile(filename) {
  const envPath = path.join(__dirname, '..', filename);
  if (fs.existsSync(envPath)) {
    console.log(`📁 加载 ${filename}...`);
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');

    lines.forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=');
          process.env[key.trim()] = value.trim();
        }
      }
    });
  } else {
    console.log(`❌ ${filename} 文件不存在`);
  }
}

// 加载环境变量文件
loadEnvFile('.env.local');
loadEnvFile('.env.development.local');

console.log('🔍 检查环境变量...\n');

// 检查所有可能的数据库 URL 环境变量
const possibleEnvVars = [
  'DATABASE_URL',
  'NEON_URL',
  'POSTGRES_URL',
  'NEON_DATABASE_URL'
];

console.log('📋 可能的数据库环境变量:');
possibleEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value.substring(0, 50)}...`);
  } else {
    console.log(`❌ ${varName}: 未设置`);
  }
});

console.log('\n🌍 所有环境变量:');
Object.keys(process.env)
  .filter(key => key.includes('DATABASE') || key.includes('NEON') || key.includes('POSTGRES'))
  .forEach(key => {
    const value = process.env[key];
    console.log(`   ${key}: ${value ? value.substring(0, 50) + '...' : '未设置'}`);
  });

console.log('\n📊 环境信息:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || '未设置'}`);
console.log(`   VERCEL: ${process.env.VERCEL || '未设置'}`);
console.log(`   VERCEL_ENV: ${process.env.VERCEL_ENV || '未设置'}`);
