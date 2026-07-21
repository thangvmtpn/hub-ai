# AI Agent Hub — Hướng dẫn Deploy

## Kiến trúc

```
Browser → Nginx (port 80/443) → Next.js (port 3900) → Anthropic API
                                      ↓
                                  users.json (auth)
                                  JWT session (cookie)
```

## 1. Chuẩn bị VPS

```bash
# Yêu cầu: Node.js 18+, npm
node -v   # >= 18.0.0
npm -v    # >= 9.0.0

# Nếu chưa có, cài qua nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

## 2. Upload & Install

```bash
# Clone hoặc upload project lên server
cd /www/wwwroot    # (hoặc thư mục bạn muốn)
git clone <repo-url> ai-agent-hub
cd ai-agent-hub

# Install dependencies
npm install
```

## 3. Cấu hình môi trường

```bash
# Copy template
cp .env.example .env

# Edit .env
nano .env
```

```env
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx     # API key thật
JWT_SECRET=$(openssl rand -hex 32)        # Tạo secret ngẫu nhiên
USERS_FILE=./users.json
```

## 4. Tạo tài khoản nhân viên

```bash
npm run seed
```

Script sẽ hỏi từng user:
- **Username**: tên đăng nhập (VD: `ngoclinh`)
- **Password**: mật khẩu (sẽ được hash bcrypt)
- **Tên hiển thị**: `Ngọc Linh`
- **Role**: `admin` (quản trị) hoặc `user` (nhân viên)
- **Department**: `all` (truy cập tất cả), `sales`, `marketing`, `accounting`, `hr`, `admin`, `support`, `management`

Hoặc tạo thủ công bằng script:

```bash
node -e "
const bcrypt = require('bcryptjs');
const users = [
  { username: 'admin', password: bcrypt.hashSync('Admin@123', 12), name: 'Admin', role: 'admin', department: 'all' },
  { username: 'sales01', password: bcrypt.hashSync('Sales@123', 12), name: 'Nhân viên Sales', role: 'user', department: 'sales' },
  { username: 'media01', password: bcrypt.hashSync('Media@123', 12), name: 'Content Creator', role: 'user', department: 'marketing' },
  { username: 'ketoan01', password: bcrypt.hashSync('Ketoan@123', 12), name: 'Kế toán viên', role: 'user', department: 'accounting' },
];
require('fs').writeFileSync('users.json', JSON.stringify(users, null, 2));
console.log('Done: ' + users.length + ' users');
"
```

## 5. Build & Start

```bash
# Build production
npm run build

# Test chạy
npm start
# → App chạy tại http://localhost:3900
```

## 6. Chạy nền với PM2

```bash
# Cài PM2 (nếu chưa có)
npm install -g pm2

# Start app
pm2 start npm --name "ai-hub" -- start

# Auto-restart khi server reboot
pm2 save
pm2 startup
```

Quản lý PM2:
```bash
pm2 status              # Xem trạng thái
pm2 logs ai-hub         # Xem log
pm2 restart ai-hub      # Restart
pm2 stop ai-hub         # Dừng
pm2 monit               # Monitor CPU/RAM
```

## 7. Cấu hình Nginx (aaPanel)

### Cách 1: Qua aaPanel UI
1. Vào **Website** → **Add Site**
2. Domain: `ai.yourdomain.com`
3. Vào **Settings** → **Reverse Proxy**
4. Target: `http://127.0.0.1:3900`
5. Bật SSL (Let's Encrypt)

### Cách 2: Cấu hình thủ công

Tạo file `/www/server/panel/vhost/nginx/ai.yourdomain.com.conf`:

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name ai.yourdomain.com;

    # SSL (Let's Encrypt qua aaPanel)
    ssl_certificate    /www/server/panel/vhost/cert/ai.yourdomain.com/fullchain.pem;
    ssl_certificate_key /www/server/panel/vhost/cert/ai.yourdomain.com/privkey.pem;

    # Force HTTPS
    if ($scheme = http) {
        return 301 https://$host$request_uri;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Proxy to Next.js
    location / {
        proxy_pass http://127.0.0.1:3900;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # SSE support (cho streaming response)
        proxy_buffering off;
        proxy_read_timeout 300s;
    }

    # Static files cache
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3900;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # Block sensitive files
    location ~ /\.(env|git|json) {
        deny all;
    }

    access_log /www/wwwlogs/ai.yourdomain.com.log;
    error_log /www/wwwlogs/ai.yourdomain.com.error.log;
}
```

```bash
# Test & reload Nginx
nginx -t
nginx -s reload
```

## 8. Bảo mật bổ sung

```bash
# Firewall: chỉ cho phép port 80, 443 từ bên ngoài
# Port 3900 chỉ listen localhost
# (Đã mặc định trong npm start)

# Giới hạn rate limit trong Nginx (thêm vào server block)
# limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
# location /api/ {
#     limit_req zone=api burst=20 nodelay;
#     proxy_pass http://127.0.0.1:3900;
# }
```

## 9. Cập nhật

```bash
cd /www/wwwroot/ai-agent-hub
git pull
npm install
npm run build
pm2 restart ai-hub
```

## 10. Thêm user sau khi deploy

```bash
cd /www/wwwroot/ai-agent-hub

# Edit trực tiếp users.json
# Hoặc chạy lại seed (sẽ ghi đè, nên backup trước)
cp users.json users.json.bak
npm run seed
```

## Cấu trúc thư mục

```
ai-agent-hub/
├── app/
│   ├── api/
│   │   ├── auth/login/route.js    # Đăng nhập
│   │   ├── auth/logout/route.js   # Đăng xuất
│   │   ├── auth/session/route.js  # Check session
│   │   └── chat/route.js          # Gọi Anthropic API (streaming)
│   ├── login/page.js              # Trang đăng nhập
│   ├── page.js                    # Trang chính (Hub)
│   ├── layout.js                  # Root layout
│   └── globals.css                # Global styles
├── lib/
│   ├── agents.js                  # 48 agent definitions
│   ├── auth.js                    # JWT auth logic
│   └── seed-users.mjs             # Script tạo user
├── middleware.js                   # Auth middleware
├── .env.example                   # Template env
├── users.json                     # User database (git-ignored)
├── package.json
├── tailwind.config.js
└── DEPLOY.md                      # File này
```
