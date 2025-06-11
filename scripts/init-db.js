const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// 手动加载环境变量
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        if (key && valueParts.length > 0) {
          process.env[key.trim()] = valueParts.join('=').trim();
        }
      }
    }
  }
}

async function initDatabase() {
  try {
    // 加载环境变量
    loadEnvFile();

    // 从环境变量获取数据库连接
    const sql = neon(process.env.DATABASE_URL);
    
    console.log('正在连接数据库...');
    
    // 创建菜品表
    await sql`
      CREATE TABLE IF NOT EXISTS dishes (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log('✅ 菜品表创建成功');
    
    // 检查表是否为空，如果为空则添加一些示例数据
    const count = await sql`SELECT COUNT(*) as count FROM dishes`;
    const dishCount = parseInt(count[0].count);
    
    if (dishCount === 0) {
      console.log('正在添加示例菜品...');
      
      const sampleDishes = [
        '红烧肉', '糖醋排骨', '宫保鸡丁', '鱼香肉丝', '麻婆豆腐',
        '回锅肉', '青椒肉丝', '蒜泥白肉', '水煮鱼', '口水鸡'
      ];
      
      for (const dish of sampleDishes) {
        try {
          await sql`INSERT INTO dishes (name) VALUES (${dish})`;
          console.log(`✅ 添加菜品: ${dish}`);
        } catch (error) {
          console.log(`⚠️  菜品 ${dish} 已存在，跳过`);
        }
      }
    } else {
      console.log(`📊 数据库中已有 ${dishCount} 道菜品`);
    }
    
    console.log('🎉 数据库初始化完成！');
    
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    process.exit(1);
  }
}

// 运行初始化
initDatabase();
