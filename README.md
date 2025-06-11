# 今天吃什么？🍽️

一个简单有趣的菜品选择应用，帮助你解决"今天吃什么"的选择困难症！

## ✨ 功能特点

- 🎲 **智能随机选择** - 一键随机选择今天要吃的菜品，告别选择困难症
- 🍽️ **菜品管理** - 轻松添加、删除、清空菜品列表
- 💾 **数据持久化** - 使用 Neon PostgreSQL 数据库存储菜品，数据永久保存
- 📱 **响应式设计** - 完美适配手机、平板和桌面端
- 🎉 **精美动画** - 流畅的交互动画和视觉效果
- 📊 **智能统计** - 显示菜品数量和有趣的提示信息
- 🚀 **快速开始** - 内置25道常见菜品，一键快速添加
- 📱 **分享功能** - 支持将选择结果分享到其他应用
- ✨ **现代化UI** - 使用 Tailwind CSS 4.0 设计的精美界面
- 🔄 **实时更新** - 支持热重载，开发体验极佳

## 🛠️ 技术栈

- **前端框架**: [Next.js 15.3.3](https://nextjs.org/) (App Router)
- **开发语言**: [TypeScript 5.x](https://www.typescriptlang.org/)
- **UI 框架**: [React 19.0](https://react.dev/)
- **样式方案**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **数据库**: [Neon PostgreSQL](https://neon.tech/) (Serverless PostgreSQL)
- **数据库驱动**: [@neondatabase/serverless](https://github.com/neondatabase/serverless)
- **构建工具**: [Turbopack](https://turbo.build/pack) (Next.js 内置)
- **代码规范**: [ESLint](https://eslint.org/) + [TypeScript ESLint](https://typescript-eslint.io/)
- **部署平台**: [Vercel](https://vercel.com/) (推荐) / 其他支持 Node.js 的平台

## 🚀 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器
- Neon PostgreSQL 数据库（免费）

### 本地开发

1. **克隆项目**
```bash
git clone <your-repo-url>
cd what-to-eat-app
```

2. **安装依赖**
```bash
npm install
# 或者使用 yarn
yarn install
```

3. **配置数据库**
```bash
# 复制环境变量文件
cp .env.local.example .env.local

# 编辑 .env.local 文件，添加你的 Neon 数据库连接字符串
# DATABASE_URL=your_neon_database_url
```

4. **初始化数据库**
```bash
npm run db:init
```

5. **启动开发服务器**
```bash
npm run dev
# 或者使用 yarn
yarn dev
```

6. **访问应用**
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 📖 使用方法

### 基本操作

1. **添加菜品**
   - 在输入框中输入菜名
   - 点击"➕ 添加"按钮或按回车键
   - 菜品会自动添加到列表中

2. **快速添加预设菜品**
   - 如果菜品列表为空，会显示"快速开始"区域
   - 点击"🍽️ 添加常见菜品"按钮
   - 系统会自动添加25道常见菜品

3. **删除菜品**
   - 悬停在菜品卡片上
   - 点击右上角的红色 "×" 按钮删除单个菜品
   - 或点击"🗑️ 清空所有"按钮清空整个列表

4. **随机选择**
   - 点击"🎲 今天吃什么"按钮
   - 系统会随机选择一道菜并显示结果
   - 想要重新选择，再次点击"🎲 今天吃什么"按钮即可

5. **分享结果**
   - 选择结果后，点击"📱 分享结果"按钮
   - 支持原生分享API或复制到剪贴板

### 高级功能

- **数据持久化**: 使用 Neon PostgreSQL 数据库存储菜品，数据永久保存
- **响应式设计**: 在手机、平板、电脑上都有良好的使用体验
- **智能统计**: 显示当前菜品数量，超过10道菜会有特殊提示
- **错误处理**: 完善的错误提示和加载状态
- **API 接口**: RESTful API 设计，支持 CRUD 操作

## 📁 项目结构

```
what-to-eat-app/
├── public/                    # 静态资源目录
│   ├── file.svg              # 图标文件
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/                       # 源代码目录
│   ├── app/                   # Next.js App Router 目录
│   │   ├── api/               # API 路由目录
│   │   │   └── dishes/        # 菜品相关 API
│   │   │       └── route.ts   # 菜品 CRUD API
│   │   ├── favicon.ico        # 网站图标
│   │   ├── globals.css        # 全局样式文件
│   │   ├── layout.tsx         # 根布局组件
│   │   └── page.tsx           # 主页面组件
│   ├── components/            # React 组件目录
│   │   ├── AddMenu.tsx        # 添加菜品组件
│   │   ├── MenuList.tsx       # 菜品列表组件
│   │   └── RandomPick.tsx     # 随机选择组件
│   └── lib/                   # 工具库目录
│       └── db.ts              # 数据库操作函数
├── scripts/                   # 脚本目录
│   └── init-db.js             # 数据库初始化脚本
├── .env.local                 # 环境变量文件（需要创建）
├── eslint.config.mjs          # ESLint 配置文件
├── next-env.d.ts              # Next.js TypeScript 声明
├── next.config.ts             # Next.js 配置文件
├── package.json               # 项目依赖和脚本
├── postcss.config.mjs         # PostCSS 配置文件
├── README.md                  # 项目说明文档
├── tsconfig.json              # TypeScript 配置文件
└── vercel.json                # Vercel 部署配置
```

### 核心组件说明

- **`page.tsx`**: 主页面组件，包含应用的主要逻辑和状态管理
- **`AddMenu.tsx`**: 菜品添加组件，处理用户输入和菜品添加逻辑
- **`MenuList.tsx`**: 菜品列表组件，展示所有菜品并提供删除功能
- **`RandomPick.tsx`**: 随机选择组件，处理随机选择逻辑和结果展示
- **`lib/db.ts`**: 数据库操作函数，包含所有菜品相关的 CRUD 操作
- **`api/dishes/route.ts`**: RESTful API 路由，处理菜品的增删改查请求

## 🗄️ 数据库配置

### Neon PostgreSQL 设置

1. **创建 Neon 账户**
   - 访问 [Neon](https://neon.tech/)
   - 使用 GitHub 账号注册（推荐）

2. **创建数据库项目**
   - 点击 "Create Project"
   - 选择区域（推荐选择离你最近的区域）
   - 项目创建完成后，获取连接字符串

3. **配置环境变量**
   ```bash
   # 创建 .env.local 文件
   echo "DATABASE_URL=your_neon_connection_string" > .env.local
   ```

4. **初始化数据库表**
   ```bash
   npm run db:init
   ```

### 数据库表结构

```sql
CREATE TABLE dishes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API 接口

- `GET /api/dishes` - 获取所有菜品
- `POST /api/dishes` - 添加菜品
  ```json
  { "name": "菜品名称" }
  // 或批量添加
  { "dishes": ["菜品1", "菜品2"] }
  ```
- `DELETE /api/dishes` - 删除菜品
  ```json
  { "name": "菜品名称" }
  // 或清空所有
  { "clearAll": true }
  ```

## 🚀 部署指南

### Vercel 部署 (推荐)

Vercel 是 Next.js 的官方部署平台，提供最佳的性能和开发体验。

#### 方法一：通过 Git 仓库部署

1. **准备代码仓库**
   ```bash
   # 将代码推送到 GitHub/GitLab/Bitbucket
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **连接 Vercel**
   - 访问 [Vercel](https://vercel.com)
   - 使用 GitHub/GitLab/Bitbucket 账号登录
   - 点击 "New Project"
   - 选择你的代码仓库

3. **配置部署**
   - Framework Preset: `Next.js`
   - Root Directory: `./` (如果项目在根目录)
   - Build Command: `npm run build` (自动检测)
   - Output Directory: `.next` (自动检测)

4. **部署完成**
   - 点击 "Deploy" 按钮
   - 等待构建完成（通常1-3分钟）
   - 获得生产环境 URL

#### 方法二：通过 Vercel CLI 部署

1. **安装 Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **登录并部署**
   ```bash
   vercel login
   vercel --prod
   ```

#### 自动部署

- 每次推送到主分支会自动触发部署
- Pull Request 会创建预览部署
- 支持自定义域名和环境变量

### 其他平台部署

#### Netlify

1. **构建设置**
   - Build command: `npm run build`
   - Publish directory: `out`

2. **添加 next.config.ts 配置**
   ```typescript
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     output: 'export',
     trailingSlash: true,
     images: {
       unoptimized: true
     }
   }

   module.exports = nextConfig
   ```

#### 传统服务器部署

1. **构建生产版本**
   ```bash
   npm run build
   ```

2. **启动生产服务器**
   ```bash
   npm start
   ```

3. **使用 PM2 (推荐)**
   ```bash
   npm install -g pm2
   pm2 start npm --name "what-to-eat-app" -- start
   pm2 save
   pm2 startup
   ```

#### Docker 部署

1. **创建 Dockerfile**
   ```dockerfile
   FROM node:18-alpine

   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production

   COPY . .
   RUN npm run build

   EXPOSE 3000
   CMD ["npm", "start"]
   ```

2. **构建和运行**
   ```bash
   docker build -t what-to-eat-app .
   docker run -p 3000:3000 what-to-eat-app
   ```

## 🛠️ 开发指南

### 开发环境设置

1. **克隆项目**
   ```bash
   git clone <your-repo-url>
   cd what-to-eat-app
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   ```

### 可用脚本

```bash
npm run dev      # 启动开发服务器 (支持热重载)
npm run build    # 构建生产版本
npm run start    # 启动生产服务器
npm run lint     # 运行 ESLint 检查代码质量
npm run db:init  # 初始化数据库表结构
```

### 技术架构

#### 状态管理
- 使用 React Hooks (`useState`, `useEffect`) 进行状态管理
- 通过 Neon PostgreSQL 数据库实现数据持久化
- 组件间通过 props 传递数据和回调函数
- 使用 RESTful API 进行前后端数据交互

#### 样式方案
- 使用 Tailwind CSS 4.0 进行样式开发
- 支持响应式设计和暗色模式
- 使用 CSS-in-JS 方式编写样式

#### 组件设计
- 采用函数式组件 + Hooks 模式
- 使用 `'use client'` 指令确保客户端渲染
- 组件化设计，职责单一，便于维护和测试

#### 类型安全
- 全面使用 TypeScript 提供类型安全
- 定义清晰的接口和类型声明
- 严格的类型检查配置

### 代码规范

- 使用 ESLint + TypeScript ESLint 进行代码检查
- 遵循 Next.js 官方推荐的代码规范
- 使用 Prettier 进行代码格式化（可选）

### 性能优化

- 使用 Next.js 15 的最新优化特性
- Turbopack 提供极快的开发构建速度
- 自动代码分割和懒加载
- 图片和字体优化

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 如何贡献

1. **Fork 项目**
2. **创建功能分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送到分支** (`git push origin feature/AmazingFeature`)
5. **创建 Pull Request**

### 贡献类型

- 🐛 Bug 修复
- ✨ 新功能开发
- 📝 文档改进
- 🎨 UI/UX 优化
- ⚡ 性能优化
- 🧪 测试用例

### 问题反馈

如果你发现了 bug 或有功能建议，请：

1. 查看 [Issues](../../issues) 确认问题未被报告
2. 创建新的 Issue，详细描述问题或建议
3. 提供复现步骤（如果是 bug）

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源协议。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - 强大的 React 框架
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Vercel](https://vercel.com/) - 优秀的部署平台
- [React](https://react.dev/) - 用户界面库
- [Neon](https://neon.tech/) - Serverless PostgreSQL 数据库

## 📞 联系方式

如果你有任何问题或建议，欢迎通过以下方式联系：

- 📧 Email: [your-email@example.com]
- 🐛 Issues: [项目 Issues 页面](../../issues)
- 💬 Discussions: [项目讨论区](../../discussions)

---

<div align="center">

**[⬆ 回到顶部](#今天吃什么)**

Made with ❤️ by [Your Name]

</div>
