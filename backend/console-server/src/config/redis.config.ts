import { registerAs } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';

export default registerAs('redisConfig', async () => {
    const store = await redisStore({
        socket: {
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT) || 6379,
        },
        ttl: 60 * 1000,
    });

    return {
        store: store,
    };
});
