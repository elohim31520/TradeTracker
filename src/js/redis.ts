const redis = require('redis');

// 創建 Redis 客戶端
const redisClient = redis.createClient({
    url: 'redis://localhost:6379'
});

// 錯誤處理
redisClient.on('error', (err: Error) => {
    console.error('Redis 客戶端錯誤:', err);
});

// 確保連接
const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Redis 連接成功');
    } catch (error) {
        console.error('Redis 連接失敗:', error);
    }
};

// 初始化連接
connectRedis();

export default redisClient; 