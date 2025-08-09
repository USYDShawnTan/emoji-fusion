import client, { Registry, Counter, Histogram, collectDefaultMetrics } from 'prom-client';

// 仅在自托管（且非 Vercel）环境启用
export const METRICS_ENABLED = process.env.METRICS_ENABLED === '1' && process.env.VERCEL !== '1';

type MetricsSingleton = {
    register: Registry;
    httpRequestCounter: Counter<string>;
    httpLatency: Histogram<string>;
};

declare global {
    // eslint-disable-next-line no-var
    var __emoji_fusion_metrics__: MetricsSingleton | undefined;
}

function createMetrics(): MetricsSingleton {
    const register = new client.Registry();

    collectDefaultMetrics({ register });

    const httpRequestCounter = new client.Counter({
        name: 'emoji_fusion_requests_total',
        help: 'Total number of HTTP requests handled by emoji-fusion',
        labelNames: ['route', 'method', 'status', 'provider'] as const,
        registers: [register],
    });

    const httpLatency = new client.Histogram({
        name: 'emoji_fusion_latency_seconds',
        help: 'Latency of HTTP requests in seconds',
        labelNames: ['route', 'method', 'status'] as const,
        buckets: [0.05, 0.1, 0.2, 0.3, 0.5, 0.75, 1, 1.5, 2, 3, 5],
        registers: [register],
    });

    return { register, httpRequestCounter, httpLatency };
}

function getMetrics(): MetricsSingleton {
    if (!global.__emoji_fusion_metrics__) {
        global.__emoji_fusion_metrics__ = createMetrics();
    }
    return global.__emoji_fusion_metrics__;
}

export const { register, httpRequestCounter, httpLatency } = getMetrics();


