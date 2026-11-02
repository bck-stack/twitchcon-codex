const HEALTH_URL = 'https://chaosforge-t5k0.onrender.com/healthz';

export default {
  async scheduled() {
    const response = await fetch(HEALTH_URL, {
      redirect: 'follow',
      headers: { 'User-Agent': 'chaosforge-keepalive/1.0' },
      cf: { cacheTtl: 0, cacheEverything: false }
    });

    if (!response.ok) {
      throw new Error(`ChaosForge health check failed: HTTP ${response.status}`);
    }
  }
};
