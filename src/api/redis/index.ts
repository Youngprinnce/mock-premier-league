import Session from 'express-session';
import RedisStore from "connect-redis";
const { NODE_ENV, REDISCLOUD_URL } = process.env;
import { createClient, RedisClientType } from 'redis';

// Set Redis URL based on environment variables
const REDIS_URL_CONFIG = REDISCLOUD_URL as string;

// Create Redis client
const client:RedisClientType = createClient({ url: REDIS_URL_CONFIG, socket:{connectTimeout:50000} });

// Log errors and exit process if Redis connection fails
client.on('error', err => {
  console.log({err});
  process.exit(1);
});

// Log message when Redis client is disconnected
client.on('end', () => console.log('Client disconnected from Redis!'));

// Connect to Redis server and log message once connected
client.connect().then(() => console.log('Client connected to Redis and ready!'));

// session
const session = Session({
  store: new RedisStore({ client }),
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: true,
});

/**
 * @description Get value stored inside of redis store
 * @param {String} key - key of the value to get from redis store
 * @returns {Promise<value>}
 */
// This function gets Redis data for a given key.
const getRedisAsync = async ({key}:{key:string}): Promise<string | null> => await client.get(key);

/**
 * @description redisTTL get redis time to live (TTL) of a key
 * @param {String} key - key of the value to get its TTL
 * @returns {Promise<value>}
 */
// This function returns the time-to-live (TTL) value for a given key in seconds.
const redisTTL = async ({key}:{key:string}): Promise<number> => await client.ttl(key);

/**
 * @description Set value stored inside of redis store, if expiry is not set, key will be persisted for life
 * @param {String} key - key of the value to save on redis store
 * @param {String} value - value to be saved on redis store
 * @param {Number} expiry - expiration in seconds
 * @returns {Promise<value>}
 */

// This function sets a Redis key and its value, with an optional expiry.
const setRedisAsync = async ({key, value, expiry = null}: {key:string, value: string, expiry?: number|null}) => {
  if (!expiry) return await client.set(key, value);
  const existingKeyTTL = await redisTTL({key});
  // If the existing key has no TTL or it has already expired,
  // set the new key and its value with the specified expiry time.
  // Otherwise, update the existing key's expiry time without changing its value.
  return existingKeyTTL <= 0 ? await client.set(key, value, {EX: expiry, NX: true}) : await client.set(key, value, {EX: existingKeyTTL, NX: true});
}

/**
 * @description redisExpire set time for a Redis key to expire
 * @param {String} key - key of the value to set its expiry
 * @param {Number} expire - expiry of the key in seconds
 * @returns {Promise<value>}
 */
// This function updates the expiry time for a given key in seconds.
const redisExpire = async ({key, expire}: {key:string, expire:number}) => await client.expire(key, expire);

/**
 * @description redisAIncr Redis Atomic Increment, increments a numeric value by 1
 * @param {String} key - key of the numerical value to increment from redis store
 * @returns {Promise<value>}
 */
// This function increments the value of a key by one and returns the new value.
const redisAIncr = async ({key}:{key:string}) => await client.incr(key);

// Exporting all functions and the Redis client instance.
export = {getRedisAsync, setRedisAsync, client, redisTTL, redisExpire, redisAIncr, session}


