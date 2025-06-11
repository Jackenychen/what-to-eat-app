const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// 加载环境变量
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
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
  }
}

// 解析 menu.txt 文件，提取所有菜品名称
function parseMenuFile() {
  const menuFilePath = path.join(__dirname, '..', '..', 'menu.txt');
  
  if (!fs.existsSync(menuFilePath)) {
    throw new Error('menu.txt 文件不存在');
  }
  
  const content = fs.readFileSync(menuFilePath, 'utf8');
  const lines = content.split('\n');
  const dishes = [];
  
  lines.forEach(line => {
    const trimmedLine = line.trim();
    
    // 跳过空行、标题行（以#开头）和分类标题行（以###或####开头）
    if (!trimmedLine || 
        trimmedLine.startsWith('#') || 
        trimmedLine.startsWith('##') ||
        trimmedLine.startsWith('###') ||
        trimmedLine.startsWith('####')) {
      return;
    }
    
    // 处理包含多个菜品的行（用、或，分隔）
    const dishesInLine = trimmedLine
      .split(/[、，,]/)
      .map(dish => dish.trim())
      .filter(dish => dish.length > 0)
      .filter(dish => !dish.includes('（') || dish.includes('）')) // 过滤掉不完整的括号内容
      .map(dish => {
        // 清理括号内的说明文字，但保留主要菜名
        return dish.replace(/（[^）]*）/g, '').replace(/\([^)]*\)/g, '').trim();
      })
      .filter(dish => dish.length > 0);
    
    dishes.push(...dishesInLine);
  });
  
  // 去重并过滤掉过短的菜名
  const uniqueDishes = [...new Set(dishes)]
    .filter(dish => dish.length >= 2) // 至少2个字符
    .filter(dish => !/^[一二三四五六七八九十]+$/.test(dish)) // 过滤掉纯数字标题
    .sort();
  
  return uniqueDishes;
}

// 批量添加菜品到数据库
async function addDishesToDatabase(dishes) {
  const sql = neon(process.env.DATABASE_URL);
  
  console.log('正在连接数据库...');
  
  // 确保表存在
  await sql`
    CREATE TABLE IF NOT EXISTS dishes (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  console.log('✅ 数据库表检查完成');
  
  let addedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  
  console.log(`开始添加 ${dishes.length} 道菜品...`);
  console.log('');
  
  for (const dish of dishes) {
    try {
      await sql`INSERT INTO dishes (name) VALUES (${dish})`;
      console.log(`✅ 添加成功: ${dish}`);
      addedCount++;
    } catch (error) {
      if (error.message && error.message.includes('duplicate key')) {
        console.log(`⚠️  已存在: ${dish}`);
        skippedCount++;
      } else {
        console.log(`❌ 添加失败: ${dish} - ${error.message}`);
        errorCount++;
      }
    }
  }
  
  console.log('');
  console.log('=== 导入完成 ===');
  console.log(`✅ 成功添加: ${addedCount} 道菜`);
  console.log(`⚠️  已存在跳过: ${skippedCount} 道菜`);
  console.log(`❌ 添加失败: ${errorCount} 道菜`);
  console.log(`📊 总计处理: ${dishes.length} 道菜`);
  
  // 显示数据库中的总菜品数量
  const totalCount = await sql`SELECT COUNT(*) as count FROM dishes`;
  console.log(`🗄️  数据库中总菜品数: ${totalCount[0].count}`);
}

// 主函数
async function main() {
  try {
    console.log('🍽️  开始导入 menu.txt 中的菜品到数据库...');
    console.log('');
    
    // 加载环境变量
    loadEnvFile();
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL 环境变量未设置');
    }
    
    // 解析菜单文件
    console.log('📖 正在解析 menu.txt 文件...');
    const dishes = parseMenuFile();
    
    console.log(`📋 解析完成，找到 ${dishes.length} 道不重复的菜品:`);
    console.log('');
    
    // 显示前10道菜作为预览
    dishes.slice(0, 10).forEach((dish, index) => {
      console.log(`   ${index + 1}. ${dish}`);
    });
    
    if (dishes.length > 10) {
      console.log(`   ... 还有 ${dishes.length - 10} 道菜`);
    }
    
    console.log('');
    
    // 添加到数据库
    await addDishesToDatabase(dishes);
    
    console.log('');
    console.log('🎉 菜品导入完成！');
    
  } catch (error) {
    console.error('❌ 导入失败:', error.message);
    process.exit(1);
  }
}

// 运行主函数
main();
