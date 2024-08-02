import redis.asyncio as redis
from app.core.config import settings

redis_client = redis.from_url(settings.redis_url)

def get_redis():
    return redis_client
