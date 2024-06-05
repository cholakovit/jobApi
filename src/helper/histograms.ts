import { Counter, Histogram } from "prom-client";

// histogram for request duration
export const requestDuration = new Histogram({
  name: 'api_request_duration_seconds',
  help: 'Duration of API requests in seconds',
  labelNames: ['method', 'endpoint', 'status_code'],
  buckets: [0.1, 0.5, 1, 2.5, 5, 10]
})

// counter for request rate
export const requestCounter = new Counter({
  name: 'api_request_total',
  help: 'Total number of API requests',
  labelNames: ['method', 'endpoint', 'status_code'],
})

export const errorCounter = new Counter({
  name: 'api_errors_total',
  help: 'Total number of API errors',
  labelNames: ['method', 'endpoint', 'status_code']
}) 

// ESM and old way what is the difference