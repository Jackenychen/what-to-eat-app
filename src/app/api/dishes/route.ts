import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllDishes, 
  addDish, 
  deleteDishByName, 
  clearAllDishes, 
  addMultipleDishes,
  createDishesTable 
} from '@/lib/db';

// 确保数据库表存在
async function ensureTableExists() {
  try {
    await createDishesTable();
  } catch (error) {
    console.error('Error ensuring table exists:', error);
  }
}

// GET - 获取所有菜品
export async function GET() {
  try {
    // 检查环境变量
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not set');
      return NextResponse.json(
        { success: false, error: 'Database configuration error' },
        { status: 500 }
      );
    }

    await ensureTableExists();
    const dishes = await getAllDishes();
    return NextResponse.json({
      success: true,
      data: dishes.map(dish => dish.name) // 返回菜品名称数组，保持与原有格式兼容
    });
  } catch (error: unknown) {
    console.error('Error in GET /api/dishes:', error);
    const errorMessage = error instanceof Error ? error.message : '获取菜品失败';
    return NextResponse.json(
      { success: false, error: errorMessage, debug: process.env.NODE_ENV === 'development' ? String(error) : undefined },
      { status: 500 }
    );
  }
}

// POST - 添加菜品
export async function POST(request: NextRequest) {
  try {
    await ensureTableExists();
    const body = await request.json();
    const { name, dishes } = body;

    if (dishes && Array.isArray(dishes)) {
      // 批量添加菜品
      const addedDishes = await addMultipleDishes(dishes);
      const allDishes = await getAllDishes();
      return NextResponse.json({ 
        success: true, 
        data: allDishes.map(dish => dish.name),
        message: `成功添加 ${addedDishes.length} 道菜品`
      });
    } else if (name) {
      // 添加单个菜品
      await addDish(name);
      const allDishes = await getAllDishes();
      return NextResponse.json({ 
        success: true, 
        data: allDishes.map(dish => dish.name),
        message: '菜品添加成功'
      });
    } else {
      return NextResponse.json(
        { success: false, error: '请提供菜品名称' },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error('Error in POST /api/dishes:', error);
    const errorMessage = error instanceof Error ? error.message : '添加菜品失败';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE - 删除菜品或清空所有
export async function DELETE(request: NextRequest) {
  try {
    await ensureTableExists();
    const body = await request.json();
    const { name, clearAll } = body;

    if (clearAll) {
      // 清空所有菜品
      await clearAllDishes();
      return NextResponse.json({ 
        success: true, 
        data: [],
        message: '所有菜品已清空'
      });
    } else if (name) {
      // 删除指定菜品
      await deleteDishByName(name);
      const allDishes = await getAllDishes();
      return NextResponse.json({ 
        success: true, 
        data: allDishes.map(dish => dish.name),
        message: '菜品删除成功'
      });
    } else {
      return NextResponse.json(
        { success: false, error: '请提供要删除的菜品名称或设置clearAll为true' },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error('Error in DELETE /api/dishes:', error);
    const errorMessage = error instanceof Error ? error.message : '删除菜品失败';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
