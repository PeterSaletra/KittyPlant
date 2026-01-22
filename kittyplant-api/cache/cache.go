package cache

import (
	"context"
	"encoding/json"
	"log"
	"strings"
	"time"

	"github.com/redis/go-redis/v9"
)

type Cache struct {
	redisClient *redis.Client
}

func NewCache(addr string, password string) *Cache {
	redisClient := redis.NewClient(&redis.Options{
		Addr: addr,
		// Password: password,
		DB: 0, // use default DB
	})
	return &Cache{
		redisClient: redisClient,
	}
}

func (c *Cache) SetObject(key string, value interface{}, expiration time.Duration) error {
	// Serialize the value to JSON
	jsonData, err := json.Marshal(value)
	if err != nil {
		return err
	}

	err = c.redisClient.Set(context.Background(), key, jsonData, expiration).Err()
	return err
}

func (c *Cache) GetObjectAll(key string) (interface{}, error) {
	ctx := context.Background()

	// Get the JSON string
	jsonData, err := c.redisClient.Get(ctx, key).Result()
	if err != nil {
		return nil, err
	}

	// Unmarshal to a generic map
	var result map[string]interface{}
	err = json.Unmarshal([]byte(jsonData), &result)
	if err != nil {
		return nil, err
	}

	return result, nil
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

	exists := c.redisClient.Exists(ctx, key).Val()
	if exists == 0 {
		log.Printf("TimeSeries key %s does not exist, cannot add data point", key)
		return nil
	}
	log.Printf("TS DATA: %f", value)
	_, err := c.redisClient.Do(ctx, "TS.ADD", key, timestamp, value).Result()
	return err
}

type TimeSeriesDataPoint struct {
	Timestamp int64   `json:"time"`
	Value     float64 `json:"value"`
}

func (c *Cache) GetMultiTimeSeriesRange(filter string, fromTimestamp, toTimestamp int64, aggregation string, bucketDuration int) ([]TimeSeriesDataPoint, error) {
	ctx := context.Background()
	filterSlice := strings.Split(filter, " ")

	result, err := c.redisClient.Do(ctx,
		"TS.MRANGE",
		fromTimestamp,
		toTimestamp,
		"AGGREGATION", aggregation, bucketDuration,
		"FILTER",
		filterSlice[0],
		filterSlice[1],
	).Result()

	if err != nil {
		log.Printf("Error retrieving time series range: %v", err)
		return nil, err
	}

	var dataPoints []TimeSeriesDataPoint

	for k := range result.(map[interface{}]interface{}) {
		dataArr, ok := result.(map[interface{}]interface{})[k].([]interface{})[2].([]interface{})
		if !ok {
			log.Printf("Failed to cast arr[2] to []interface{}")
			continue
		}

		for i, item := range dataArr {
			pair, ok := item.([]interface{})
			if !ok {
				log.Printf("Item %d is not an array", i)
				continue
			}

			if len(pair) != 2 {
				log.Printf("Item %d has wrong length: %d", i, len(pair))
				continue
			}

			timestamp, ok := pair[0].(int64)
			if !ok {
				log.Printf("Item %d: timestamp is not float64, type: %T", i, pair[0])
				continue
			}

			value, ok := pair[1].(float64)
			if !ok {
				log.Printf("Item %d: value is not float64, type: %T", i, pair[1])
				continue
			}
			dataPoints = append(dataPoints, TimeSeriesDataPoint{
				Timestamp: int64(timestamp),
				Value:     value,
			})
		}
	}

	return dataPoints, nil
}

func (c *Cache) DeleteTimeSeries(key string) error {
	ctx := context.Background()
	_, err := c.redisClient.Do(ctx, "DEL", key).Result()
	return err
}

func (c *Cache) TimeSeriesExists(key string) bool {
	ctx := context.Background()
	result := c.redisClient.Exists(ctx, key).Val()
	return result > 0
}
