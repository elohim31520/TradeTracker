# --- Builder Stage ---
# 使用官方的 Node.js 22 Alpine Linux 映像作為建置器
FROM node:22-alpine AS builder

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝所有依賴，包括用於建置的 devDependencies
RUN npm ci

# 複製專案的其餘檔案
COPY . .

# 編譯 TypeScript 程式碼
RUN npm run build

# --- Production Stage ---
# 使用輕量的 Node.js 映像作為正式環境
FROM node:22-alpine

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 只安裝正式環境的依賴，以保持映像檔的輕量
RUN npm ci --omit=dev

# 從建置器階段複製編譯後的程式碼
COPY --from=builder /app/dist ./dist

# 從建置器階段複製 Sequelize 的設定、遷移和模型檔案
COPY --from=builder /app/config ./config
COPY --from=builder /app/migrations ./migrations
COPY --from=builder /app/seeders ./seeders
COPY --from=builder /app/models ./models

# 從建置器階段複製 public 資料夾
COPY --from=builder /app/public ./public

# 開放應用程式運行的端口
EXPOSE 1234

# 定義容器啟動時要執行的命令
CMD [ "npm", "start" ] 