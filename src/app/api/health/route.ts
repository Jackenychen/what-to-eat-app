import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

export async function GET() {
  try {
    // 检查环境变量
    const databaseUrl = process.env.NEON_URL || process.env.DATABASE_URL;
    if (!databaseUrl) {
      return NextResponse.json({
        status: 'error',
        message: 'Database URL environment variable is not set (NEON_URL or DATABASE_URL)',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    // 测试数据库连接
    const sql = neon(databaseUrl);
    await sql`SELECT 1 as test`;

    // 检查菜品表是否存在
    const tableCheck = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'dishes'
      );
    `;

    const dishCount = await sql`SELECT COUNT(*) as count FROM dishes`;

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      table_exists: tableCheck[0].exists,
      dish_count: dishCount[0].count,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown'
    });

  } catch (error: unknown) {
    console.error('Health check failed:', error);
    return NextResponse.json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
