// 检查环境变量的脚本
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
