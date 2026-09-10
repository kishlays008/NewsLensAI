// Minimal in-memory, per-IP rate limiter. Good enough for a single-instance
// deployment; resets if the process restarts and doesn't share state across
// multiple instances, but that's an acceptable tradeoff here.
export const rateLimit = ({ windowMs, max }) => {
  const hits = new Map(); // ip -> [timestamps]

  return (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const windowStart = now - windowMs;

    const timestamps = (hits.get(ip) || []).filter((t) => t > windowStart);
    timestamps.push(now);
    hits.set(ip, timestamps);

    if (timestamps.length > max) {
      return res.status(429).json({
        message: `Too many requests. Please try again in a bit (limit: ${max} per ${Math.round(windowMs / 60000)} min).`,
      });
    }

    next();
  };
};
