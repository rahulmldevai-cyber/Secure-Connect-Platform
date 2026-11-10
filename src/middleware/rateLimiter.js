function createRateLimiter({
  windowMs = 15 * 60 * 1000,
  max = 50,
  message = 'Too many requests. Please try again later.'
} = {}) {
  const hits = new Map();

  const interval = setInterval(() => {
    const now = Date.now();

    for (const [key, value] of hits) {
      if (now - value.windowStart > windowMs) {
        hits.delete(key);
      }
    }
  }, windowMs);

  interval.unref();

  return (req, res, next) => {
    const key = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const record = hits.get(key);

    if (!record || now - record.windowStart > windowMs) {
      hits.set(key, { windowStart: now, count: 1 });
      return next();
    }

    record.count += 1;

    if (record.count > max) {
      return res.status(429).json({
        success: false,
        message
      });
    }

    return next();
  };
}

module.exports = { createRateLimiter };