import { neon } from '@neondatabase/serverless';

// 初始化数据库连接 - 支持多种环境变量名
const databaseUrl = process.env.NEON_URL || process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('Database URL not found. Please set NEON_URL or DATABASE_URL environment variable.');
}
const sql = neon(databaseUrl);

// 菜品接口定义
export interface Dish {
  id: number;
  name: string;
  created_at: string;
}

// 创建菜品表（如果不存在）
export async function createDishesTable() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS dishes (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('Dishes table created or already exists');
  } catch (error) {
    console.error('Error creating dishes table:', error);
    throw error;
  }
}

// 获取所有菜品
export async function getAllDishes(): Promise<Dish[]> {
  try {
    const dishes = await sql`
      SELECT id, name, created_at 
      FROM dishes 
      ORDER BY created_at DESC
    `;
    return dishes as Dish[];
  } catch (error) {
    console.error('Error fetching dishes:', error);
    throw error;
  }
}

// 添加新菜品
export async function addDish(name: string): Promise<Dish> {
  try {
    const trimmedName = name.trim();
    if (!trimmedName) {
      throw new Error('菜品名称不能为空');
    }

    const result = await sql`
      INSERT INTO dishes (name) 
      VALUES (${trimmedName}) 
      RETURNING id, name, created_at
    `;
    
    if (result.length === 0) {
      throw new Error('添加菜品失败');
    }
    
    return result[0] as Dish;
  } catch (error: unknown) {
    if (error instanceof Error && error.message?.includes('duplicate key')) {
      throw new Error('该菜品已存在');
    }
    console.error('Error adding dish:', error);
    throw error;
  }
}

// 删除菜品
export async function deleteDish(id: number): Promise<void> {
  try {
    await sql`
      DELETE FROM dishes
      WHERE id = ${id}
    `;
    console.log(`Deleted dish with id: ${id}`);
  } catch (error) {
    console.error('Error deleting dish:', error);
    throw error;
  }
}

// 根据名称删除菜品
export async function deleteDishByName(name: string): Promise<void> {
  try {
    await sql`
      DELETE FROM dishes
      WHERE name = ${name}
    `;
    console.log(`Deleted dish: ${name}`);
  } catch (error) {
    console.error('Error deleting dish by name:', error);
    throw error;
  }
}

// 清空所有菜品
export async function clearAllDishes(): Promise<void> {
  try {
    await sql`DELETE FROM dishes`;
    console.log('All dishes cleared');
  } catch (error) {
    console.error('Error clearing all dishes:', error);
    throw error;
  }
}

// 批量添加菜品
export async function addMultipleDishes(dishes: string[]): Promise<Dish[]> {
  try {
    const addedDishes: Dish[] = [];
    
    for (const dishName of dishes) {
      try {
        const dish = await addDish(dishName);
        addedDishes.push(dish);
      } catch (error: unknown) {
        // 如果菜品已存在，跳过但不报错
        if (!(error instanceof Error && error.message?.includes('已存在'))) {
          console.error(`Error adding dish ${dishName}:`, error);
        }
      }
    }
    
    return addedDishes;
  } catch (error) {
    console.error('Error adding multiple dishes:', error);
    throw error;
  }
}

// 获取菜品数量
export async function getDishCount(): Promise<number> {
  try {
    const result = await sql`SELECT COUNT(*) as count FROM dishes`;
    return parseInt(result[0].count as string);
  } catch (error) {
    console.error('Error getting dish count:', error);
    throw error;
  }
}

// 随机获取一道菜
export async function getRandomDish(): Promise<Dish | null> {
  try {
    const result = await sql`
      SELECT id, name, created_at 
      FROM dishes 
      ORDER BY RANDOM() 
      LIMIT 1
    `;
    
    return result.length > 0 ? result[0] as Dish : null;
  } catch (error) {
    console.error('Error getting random dish:', error);
    throw error;
  }
}
