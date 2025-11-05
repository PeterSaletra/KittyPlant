package cache

import (
	"context"
	"time"

	"github.com/redis/go-redis/v9"
)

type Cache struct {
	redisClient *redis.Client
}

func NewCache(addr string, password string) *Cache {
	redisClient := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
		DB:       0, // use default DB
	})
	return &Cache{
		redisClient: redisClient,
	}
}

func (c *Cache) SetObject(key string, value interface{}, expiration time.Duration) error {
	pipe := c.redisClient.Pipeline()
	pipe.HSet(context.Background(), key, value)
	if expiration > 0 {
		pipe.Expire(context.Background(), key, expiration)
	}
	_, err := pipe.Exec(context.Background())
	return err
}

func (c *Cache) GetObjectAll(key string) (interface{}, error) {
	var result interface{}

	pipe := c.redisClient.Pipeline()
	pipe.HGetAll(context.Background(), key).Scan(&result)

	ttl, err := pipe.TTL(context.Background(), key).Result()
	if err != nil && ttl > 0 {
		pipe.Expire(context.Background(), key, ttl)
	}

	_, err = pipe.Exec(context.Background())
	return result, err
}

func (c *Cache) GetObjectField(key string, field string) (interface{}, error) {
	var result interface{}

	pipe := c.redisClient.Pipeline()
	pipe.HGet(context.Background(), key, field).Scan(&result)

	ttl, err := pipe.TTL(context.Background(), key).Result()
	if err != nil && ttl > 0 {
		pipe.Expire(context.Background(), key, ttl)
	}

	_, err = pipe.Exec(context.Background())
	return result, err
}

func (c *Cache) Set(key string, value interface{}, expiration time.Duration) error {
	return c.redisClient.Set(context.Background(), key, value, expiration).Err()
}

func (c *Cache) Get(key string) (string, error) {
	pipe := c.redisClient.Pipeline()
	result, err := pipe.Get(context.Background(), key).Result()
	if err != nil {
		return "", err
	}

	ttl, err := pipe.TTL(context.Background(), key).Result()
	if err != nil && ttl > 0 {
		pipe.Expire(context.Background(), key, ttl)
	}

	_, err = pipe.Exec(context.Background())
	return result, err
}
