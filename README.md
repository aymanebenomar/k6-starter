x<p align="center">
  <img src="https://grafana.com/media/menus/products/grafana-menu-icon-k6.svg" width="120" alt="Grafana k6 logo" />
</p>

<h1 align="center">k6 Load Test Starter</h1>

<p align="center">
  Simple JavaScript load testing starter project using Grafana k6.
</p>

<p align="center">
  <a href="https://grafana.com/docs/k6/latest/">k6 Docs</a> ·
  <a href="https://grafana.com/docs/k6/latest/set-up/install-k6/">Install k6</a> ·
  <a href="https://grafana.com/docs/k6/latest/get-started/running-k6/">Run k6</a>
</p>

---

## What is this repo?

This is a beginner-friendly **k6 JavaScript load testing** repo.

It helps you test how your website behaves when many users visit it at the same time.

The test:

- visits one website URL
- increases the number of virtual users every **3 minutes**
- checks if the website returns a successful status
- checks if response time stays under **1000ms**
- reports request duration, failed requests, virtual users, and checks

> This repo is **JavaScript only**.

---

## Test code file

The main test file is here:

[tests/test-load.js](tests/test-load.js)

---

## Load plan

The test increases traffic every **3 minutes**.

| Time | Virtual users |
|---|---:|
| 0-3 minutes | 50 users |
| 3-6 minutes | 90 users |
| 6-9 minutes | 180 users |
| 9-12 minutes | 260 users |
| 12-15 minutes | 0 users / stop |

---

## Where to put your website

Open this file:

```text
tests/simple-load-test.js
```

Find this line:

```js
const WEBSITE_URL = __ENV.WEBSITE_URL || 'https://carreera.com';
```

Replace `https://carreera.com` with your own website:

```js
const WEBSITE_URL = __ENV.WEBSITE_URL || 'https://your-website.com';
```

You can also keep the file unchanged and pass your website from the terminal:

```bash
k6 run -e WEBSITE_URL=https://your-website.com tests/simple-load-test.js
```

Example:

```bash
k6 run -e WEBSITE_URL=https://example.com tests/simple-load-test.js
```

---

# Install k6

After installing k6, check that it works:

```bash
k6 version
```

---

## macOS

Install with Homebrew:

```bash
brew install k6
```

Upgrade:

```bash
brew upgrade k6
```

---

## Windows

### Option 1: Windows Package Manager

```powershell
winget install k6 --source winget
```

Upgrade:

```powershell
winget upgrade k6
```

### Option 2: Chocolatey

```powershell
choco install k6
```

Upgrade:

```powershell
choco upgrade k6
```

### Option 3: MSI installer

Download the latest official Windows installer:

```text
https://dl.k6.io/msi/k6-latest-amd64.msi
```

---

## Linux: Debian / Ubuntu

Install:

```bash
curl -fsSL https://dl.k6.io/key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/k6-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list

sudo apt-get update

sudo apt-get install k6
```

Upgrade:

```bash
sudo apt-get update
sudo apt-get install k6
```

---

## Linux: Fedora / CentOS / RHEL

Install with `dnf`:

```bash
sudo dnf install https://dl.k6.io/rpm/repo.rpm
sudo dnf install k6
```

Upgrade:

```bash
sudo dnf upgrade k6
```

For older systems, use `yum` instead of `dnf`.

---

## Docker

Pull the official k6 Docker image:

```bash
docker pull grafana/k6
```

Run the test with Docker on macOS/Linux:

```bash
docker run --rm -v "$PWD:/scripts" grafana/k6 run /scripts/tests/simple-load-test.js
```

Run the test with Docker on Windows PowerShell:

```powershell
docker run --rm -v ${PWD}:/scripts grafana/k6 run /scripts/tests/simple-load-test.js
```

Run the test with Docker and your own website:

```bash
docker run --rm -v "$PWD:/scripts" -e WEBSITE_URL=https://your-website.com grafana/k6 run /scripts/tests/simple-load-test.js
```

---

## Standalone binary

You can download the standalone k6 binary from GitHub Releases:

```text
https://github.com/grafana/k6/releases
```

After downloading and extracting it, put `k6` or `k6.exe` in your system `PATH`.

---

# Run the test

Run with the website inside the code:

```bash
k6 run tests/simple-load-test.js
```

Run with your own website without changing the code:

```bash
k6 run -e WEBSITE_URL=https://your-website.com tests/simple-load-test.js
```

Example:

```bash
k6 run -e WEBSITE_URL=https://carreera.com tests/simple-load-test.js
```

---

# Test code

```js
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

const WEBSITE_URL = __ENV.WEBSITE_URL || 'https://carreera.com';

export const options = {
  stages: [
    // The load goes up every 3 minutes
    { duration: '3m', target: 50 },   // 0-3 min: 50 users
    { duration: '3m', target: 90 },   // 3-6 min: 90 users
    { duration: '3m', target: 180 },  // 6-9 min: 180 users
    { duration: '3m', target: 260 },  // 9-12 min: 260 users
    { duration: '3m', target: 0 },    // 12-15 min: stop the test
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
```

---

# Understand the important parts

## Website URL

```js
const WEBSITE_URL = __ENV.WEBSITE_URL || 'https://carreera.com';
```

This means:

- use the terminal website if `WEBSITE_URL` is passed
- otherwise use `https://carreera.com`

---

## Stages

```js
stages: [
  { duration: '3m', target: 50 },
  { duration: '3m', target: 90 },
  { duration: '3m', target: 180 },
  { duration: '3m', target: 260 },
  { duration: '3m', target: 0 },
]
```

This means the load goes up every **3 minutes**.

---

## Thresholds

```js
thresholds: {
  http_req_failed: ['rate<0.05'],
  http_req_duration: ['p(95)<1000'],
}
```

This means:

- fewer than **5%** of requests should fail
- **95%** of requests should finish under **1000ms**

---

## Checks

```js
check(response, {
  'status is OK': (r) => r.status >= 200 && r.status < 400,
  'response time is under 1000ms': (r) => r.timings.duration < 1000,
});
```

This checks:

- the website returns a successful status
- the website responds in under 1000ms

---

# What k6 results mean

| Metric | Meaning |
|---|---|
| `http_req_duration` | How long requests took |
| `http_req_failed` | Percentage of failed requests |
| `checks` | Whether your checks passed |
| `vus` | Virtual users currently running |
| `vus_max` | Maximum virtual users allocated |
| `iterations` | How many times the test function ran |
| `data_received` | Total data downloaded |
| `data_sent` | Total data uploaded |

---

# Important safety note

Only run load tests against:

- your own website
- your own API
- a local app
- a demo/testing website
- a company system where you have permission

Do **not** run load tests against random websites. Load testing can create heavy traffic and may look like an attack if you do not have permission.

---

# Upload this repo to GitHub

## Option 1: GitHub website

1. Go to GitHub.
2. Click **New repository**.
3. Name it:

```text
k6-load-test-starter
```

4. Make it public.
5. Upload the files from this folder.
6. Share the GitHub link.

---

## Option 2: Terminal

Inside this folder, run:

```bash
git init
git add .
git commit -m "Initial k6 load test starter"
git branch -M main
```

Then create a new empty GitHub repo and connect it:

```bash
git remote add origin https://github.com/YOUR-USERNAME/k6-load-test-starter.git
git push -u origin main
```

---

# Documentation links

- k6 docs: https://grafana.com/docs/k6/latest/
- Install k6: https://grafana.com/docs/k6/latest/set-up/install-k6/
- Run k6: https://grafana.com/docs/k6/latest/get-started/running-k6/
- k6 environment variables: https://grafana.com/docs/k6/latest/using-k6/environment-variables/
- k6 thresholds: https://grafana.com/docs/k6/latest/using-k6/thresholds/
- k6 checks: https://grafana.com/docs/k6/latest/using-k6/checks/
- k6 HTTP requests: https://grafana.com/docs/k6/latest/using-k6/http-requests/
- k6 options: https://grafana.com/docs/k6/latest/using-k6/k6-options/

---

## License

MIT License.
