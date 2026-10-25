// In-memory fixed-window limiter. Resets on server restart and is per-instance,
// so on serverless hosts swap the Map for a shared store (e.g. Upstash Redis).
const buckets = new Map();

export function rateLimit(key, { limit, windowMs }) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now >= bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 10000) {
      for (const [k, b] of buckets) if (now >= b.resetAt) buckets.delete(k);
    }
    return { allowed: true };
  }

  if (bucket.count >= limit) return { allowed: false };
  bucket.count += 1;
  return { allowed: true };
}
