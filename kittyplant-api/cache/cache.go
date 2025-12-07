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

func (c *Cache) CreateTimeSeries(key string, retenstion string, labels map[string]string) error {
	ctx := context.Background()

	var labelArgs []interface{}
	for k, v := range labels {
		labelArgs = append(labelArgs, k, v)
	}

	args := []interface{}{"TS.CREATE", key, "RETENTION", retenstion}
	if len(labelArgs) > 0 {
		args = append(args, "LABELS")
		args = append(args, labelArgs...)
	}

	_, err := c.redisClient.Do(ctx, args...).Result()

	return err
}

func (c *Cache) AddTimeSeriesDataPoint(key string, timestamp int64, value float64) error {
	ctx := context.Background()
	_, err := c.redisClient.Do(ctx, "TS.ADD", key, timestamp, value).Result()
	return err
}

func (c *Cache) GetMultiTimeSeriesRange(filter string, fromTimestamp, toTimestamp int64, aggregation string, bucketDuration int64) ([]interface{}, error) {
	ctx := context.Background()

	var args []interface{}
	args = []interface{}{"TS.MRANGE", fromTimestamp, toTimestamp, "FILTER", filter}

	if aggregation != "" && bucketDuration > 0 {
		args = append(args, "AGGREGATION", aggregation, bucketDuration)
	}

	result, err := c.redisClient.Do(ctx, args...).Result()
	if err != nil {
		return nil, err
	}

	return result.([]interface{}), nil
}

func (c *Cache) TimeSeriesExists(key string) bool {
	ctx := context.Background()
	result := c.redisClient.Exists(ctx, key).Val()
	return result > 0
}
