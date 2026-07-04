import http from 'k6/http';
import { check, sleep } from 'k6';

// ============================================================
// PUT YOUR WEBSITE HERE
// ============================================================
// Option 1: Replace the default URL below:
// const WEBSITE_URL = __ENV.WEBSITE_URL || 'https://your-website.com';
//
// Option 2: Keep the file the same and run:
// k6 run -e WEBSITE_URL=https://your-website.com tests/simple-load-test.js
// ============================================================

const WEBSITE_URL = __ENV.WEBSITE_URL || 'https://test.k6.io';

export const options = {
  stages: [
    // The load goes up every 3 minutes
    { duration: '3m', target: 1 },   // 0-3 min: 1 user
    { duration: '3m', target: 5 },   // 3-6 min: 5 users
    { duration: '3m', target: 10 },  // 6-9 min: 10 users
    { duration: '3m', target: 15 },  // 9-12 min: 15 users
    { duration: '3m', target: 0 },   // 12-15 min: stop the test
  ],

  thresholds: {
    // Less than 5% failed requests
    http_req_failed: ['rate<0.05'],

    // 95% of requests should finish under 1000ms
    http_req_duration: ['p(95)<1000'],
  },
};

export default function () {
  const response = http.get(WEBSITE_URL);

  check(response, {
    'status is OK': (r) => r.status >= 200 && r.status < 400,
    'response time is under 1000ms': (r) => r.timings.duration < 1000,
  });

  // Wait 1 second before the same virtual user sends another request
  sleep(1);
}
