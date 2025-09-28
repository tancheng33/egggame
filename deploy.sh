#!/bin/bash

# 部署脚本
echo "开始部署婚礼金蛋游戏..."

# 构建Docker镜像
echo "构建Docker镜像..."
docker build -t wedding-golden-egg-game .

# 停止并删除现有容器
echo "停止现有容器..."
docker stop wedding-golden-egg-game 2>/dev/null || true
docker rm wedding-golden-egg-game 2>/dev/null || true

# 启动新容器
echo "启动新容器..."
docker run -d \
  --name wedding-golden-egg-game \
  -p 80:80 \
  --restart unless-stopped \
  wedding-golden-egg-game

echo "部署完成！"
echo "访问地址: http://localhost"
