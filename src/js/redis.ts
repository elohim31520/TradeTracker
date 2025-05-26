const redis = require('redis');

// 創建 Redis 客戶端
const redisClient = redis.createClient({
    url: 'redis://localhost:6379'
});

// 錯誤處理
redisClient.on('error', (err: Error) => {
    console.error('Redis 客戶端錯誤:', err);
});

export default redisClient; 