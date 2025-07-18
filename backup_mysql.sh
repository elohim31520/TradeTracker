#!/bin/bash

# MySQL 連接信息
DB_USER=""
DB_PASS=""
DB_NAME=""
DB_HOST=""
DB_PORT=""

# 備份設置
BACKUP_DIR="$HOME/mysql_backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${DATE}.sql"

# 檢查並創建備份目錄
if [ ! -d "$BACKUP_DIR" ]; then
    echo "創建備份目錄: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
    if [ $? -ne 0 ]; then
        echo "錯誤：無法創建備份目錄"
        exit 1
    fi
fi

# 檢查目錄是否可寫
if [ ! -w "$BACKUP_DIR" ]; then
    echo "錯誤：備份目錄無寫入權限"
    exit 1
fi

# 輸出開始信息
echo "開始備份數據庫 $DB_NAME"
echo "時間: $(date)"

# 執行備份
mysqldump 	--user=$DB_USER \
			--password=$DB_PASS \
			--host=$DB_HOST \
			--port=$DB_PORT \
			--databases $DB_NAME \
			--add-drop-database \
			--add-drop-table \
			--create-options \
			--quote-names \
			--single-transaction \
			--quick > "$BACKUP_FILE"

# 檢查備份是否成功
if [ $? -eq 0 ]; then
    echo "數據庫備份成功"
    echo "備份文件: $BACKUP_FILE"
    
    # 壓縮備份文件
    gzip "$BACKUP_FILE"
    echo "備份文件已壓縮: ${BACKUP_FILE}.gz"
else
    echo "備份失敗"
    exit 1
fi

# 刪除超過30天的備份文件
find "$BACKUP_DIR" -name "*.gz" -type f -mtime +30 -delete

echo "備份完成"
echo "完成時間: $(date)" 