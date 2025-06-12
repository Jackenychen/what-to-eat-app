# 项目开发与部署问题总结

## 📋 项目概述
**项目名称**: 今天吃什么 (What to Eat App)  
**技术栈**: Next.js 15, React 19, TypeScript, Tailwind CSS, Neon PostgreSQL  
**部署平台**: Vercel  
**开发时间**: 2024年12月

---

## 🚨 主要问题及解决方案

### 1. 环境变量配置问题

#### 问题描述
- 项目代码中使用了 `process.env.NEON_URL || process.env.DATABASE_URL` 的环境变量获取方式
- 在 Vercel 部署时，最初只配置了 `DATABASE_URL`，但代码优先查找 `NEON_URL`
- 导致部署后数据库连接失败

#### 解决方案
1. **统一环境变量命名**: 建议只使用 `DATABASE_URL` (业界标准)
2. **Vercel 环境变量配置**:
   - Name: `NEON_URL` 或 `DATABASE_URL`
   - Value: `postgres://neondb_owner:npg_TrKYVZ8h6NQM@ep-sparkling-dew-a4raet5f-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require`
   - Environment: Production, Preview, Development

#### 经验教训
- 环境变量命名要保持一致性
- 代码中的环境变量获取逻辑要与实际配置匹配

---

### 2. .gitignore 配置导致的部署问题

#### 问题描述
- 初期为了解决部署问题，修改了 `.gitignore` 文件，移除了对 `.env*` 文件的忽略
- 导致敏感的环境变量文件被提交到 GitHub 仓库
- 虽然解决了部署问题，但存在安全隐患

#### 解决方案
1. **恢复标准 .gitignore 配置**:
   ```gitignore
   # env files (can opt-in for committing if needed)
   .env*
   ```
2. **从 Git 仓库中移除敏感文件**:
   ```bash
   git rm --cached .env.local
   git rm -r --cached .next/
   git rm --cached next-env.d.ts
   ```
3. **使用 Vercel 环境变量功能**替代提交环境文件

#### 经验教训
- 永远不要将敏感信息提交到代码仓库
- 使用云平台的环境变量管理功能
- `.gitignore` 的标准配置有其存在的理由

---

### 3. vercel.json 配置冲突 (核心问题)

#### 问题描述
项目中存在一个错误的 `vercel.json` 配置文件:
```json
{
  "name": "what-to-eat-app",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/"
    }
  ]
}
```

**问题分析**:
1. **路由冲突**: `"src": "/(.*)", "dest": "/"` 将所有请求重定向到根路径
2. **API 路由失效**: `/api/dishes` 等 API 请求被重定向到 `/`，导致数据库调用失败
3. **版本冲突**: 使用了 Vercel v2 配置格式，与 Next.js 15 App Router 不兼容
4. **构建配置过时**: Next.js 15 应该使用 Vercel 的自动检测机制

#### 影响
- **本地开发正常**: Next.js 开发服务器忽略 `vercel.json`
- **Vercel 部署失败**: 页面无法渲染，数据库连接失败，显示静态 HTML

#### 解决方案
**完全删除 `vercel.json` 文件**:
```bash
rm vercel.json
git add -A
git commit -m "删除错误的vercel.json配置文件"
git push
```

#### 为什么删除后就正常了？
1. **Vercel 自动检测**: 自动识别 Next.js 项目并使用最佳配置
2. **App Router 正常工作**: Next.js 15 的路由系统不再被覆盖
3. **API 路由恢复**: `/api/*` 路由正常工作，数据库连接成功

#### 经验教训
- **Next.js 15+ 项目通常不需要 `vercel.json`**
- 过时的配置文件可能导致严重的部署问题
- 当本地正常但部署失败时，检查平台特定的配置文件

---

### 4. 数据库表结构问题

#### 问题描述
- 项目使用 `dishes` 表，但参考教程中使用的是 `comments` 表
- 需要手动在 Neon 数据库中创建正确的表结构

#### 解决方案
在 Neon SQL Editor 中执行:
```sql
CREATE TABLE IF NOT EXISTS dishes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加测试数据
INSERT INTO dishes (name) VALUES 
('红烧肉'), ('糖醋排骨'), ('宫保鸡丁'), ('鱼香肉丝'), ('麻婆豆腐')
ON CONFLICT (name) DO NOTHING;
```

#### 经验教训
- 确保数据库表结构与代码中的模型匹配
- 使用 `IF NOT EXISTS` 避免重复创建表的错误

---

## 🔧 技术细节

### 环境变量优先级
代码中的环境变量获取逻辑:
```typescript
const databaseUrl = process.env.NEON_URL || process.env.DATABASE_URL;
```
- 优先使用 `NEON_URL`
- 如果不存在则使用 `DATABASE_URL`

### Next.js 15 App Router 特点
- 使用 `src/app` 目录结构
- API 路由位于 `src/app/api/` 目录
- 自动路由生成，无需手动配置

### Vercel 部署最佳实践
1. **删除不必要的配置文件**: 让 Vercel 自动检测项目类型
2. **使用环境变量**: 在 Vercel 控制台配置敏感信息
3. **检查构建日志**: 部署失败时查看详细日志

---

## 📊 问题解决时间线

1. **初始部署失败** → 尝试修改 `.gitignore`
2. **环境变量问题** → 配置 `NEON_URL`
3. **仍然失败** → 发现 `vercel.json` 配置问题
4. **删除 vercel.json** → 问题解决 ✅

---

## 💡 最佳实践总结

### 开发阶段
- 使用标准的项目结构和配置
- 遵循框架的最佳实践
- 不要随意修改 `.gitignore` 等关键配置

### 部署阶段
- 优先使用平台的自动检测功能
- 在云平台配置环境变量，不要提交到代码仓库
- 当部署失败时，检查平台特定的配置文件

### 调试技巧
- 对比本地和部署环境的差异
- 检查构建日志和运行时日志
- 使用健康检查 API 验证服务状态

---

## 🎯 项目成功部署后的状态

- ✅ **本地开发**: `npm run dev` 正常运行
- ✅ **Vercel 部署**: 页面正常渲染，数据库连接成功
- ✅ **API 功能**: 增删改查操作正常
- ✅ **安全性**: 敏感信息通过环境变量管理
- ✅ **代码质量**: 遵循 Next.js 15 最佳实践

---

*文档创建时间: 2024年12月*  
*最后更新: 项目成功部署后*
