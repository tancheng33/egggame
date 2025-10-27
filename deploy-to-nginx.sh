#!/bin/bash

# 服务器配置
SERVER="106.14.32.99"
USER="root"
PASSWORD='jQ5nyV$GYquHC#YgC62U&p252sss'
REMOTE_DIR="/usr/share/nginx/html"
LOCAL_FILE="wedding-game.tar.gz"

echo "开始部署到nginx服务器..."

# 使用expect自动输入密码
expect << 'EOF'
set timeout 30
set password {jQ5nyV$GYquHC#YgC62U&p252sss}

spawn scp -o StrictHostKeyChecking=no wedding-game.tar.gz root@106.14.32.99:/tmp/
expect "password:"
send "$password\r"
expect eof

spawn ssh -o StrictHostKeyChecking=no root@106.14.32.99 "cd /root/site/dist && rm -rf * && tar -xzf /tmp/wedding-game.tar.gz && rm /tmp/wedding-game.tar.gz && echo '部署完成！'"
expect "password:"
send "$password\r"
expect eof
EOF

echo "部署成功！访问地址: http://$SERVER"

