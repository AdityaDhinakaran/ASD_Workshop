const TTL_MS = 60 * 1000;
const cache = new Map();

function cacheKey(req) {
  return req.originalUrl;
}

function cacheGet(req, res, next) {
  const key = cacheKey(req);
  const entry = cache.get(key);

  if (entry && Date.now() - entry.createdAt < TTL_MS) {
    res.set('X-Cache', 'HIT');
    return res.status(entry.status).json(entry.value);
  }
  if (entry) cache.delete(key);

  res.set('X-Cache', 'MISS');
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cache.set(key, { value: body, status: res.statusCode, createdAt: Date.now() });
    }
    return originalJson(body);
  };
  return next();
}

function invalidateCache(req, res, next) {
  const originalJson = res.json.bind(res);
  const originalEnd = res.end.bind(res);
  const invalidateIfSuccessful = () => {
    if (res.statusCode >= 200 && res.statusCode < 300) cache.clear();
  };
  res.json = (body) => {
    invalidateIfSuccessful();
    return originalJson(body);
  };
  res.end = (...args) => {
    invalidateIfSuccessful();
    return originalEnd(...args);
  };
  return next();
}

module.exports = { cacheGet, invalidateCache };
