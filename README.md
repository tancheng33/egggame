# 婚礼金蛋游戏

一个基于Next.js的婚礼抽奖游戏，支持静态部署。

## 功能特性

- 🎯 12个金蛋抽奖
- 🤖 AI智能提示
- 🎰 随机选人功能
- 🎉 奖品展示
- 📱 响应式设计

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建静态文件
pnpm build
```

## Docker部署

### 方法一：使用Docker命令

```bash
# 构建镜像
docker build -t wedding-golden-egg-game .

# 运行容器
docker run -d \
  --name wedding-golden-egg-game \
  -p 80:80 \
  --restart unless-stopped \
  wedding-golden-egg-game
```

### 方法二：使用Docker Compose

```bash
# 启动服务
docker-compose up -d

# 停止服务
docker-compose down
```

### 方法三：使用部署脚本

```bash
# 运行部署脚本
./deploy.sh
```

## 静态文件部署

构建后的静态文件位于 `out/` 目录，可以直接部署到任何静态文件服务器：

- Nginx
- Apache
- CDN
- Vercel
- Netlify

## 配置说明

- `next.config.mjs`: Next.js配置，已配置静态导出
- `nginx.conf`: Nginx配置文件
- `Dockerfile`: Docker构建文件
- `docker-compose.yml`: Docker Compose配置

## 访问地址

部署完成后，访问 `http://localhost` 即可使用游戏。
