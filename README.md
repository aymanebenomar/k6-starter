# k6 JavaScript Load Testing Starter

A simple beginner-friendly k6 repo that you can share with anyone who wants to learn **load testing**.

This repo is **JavaScript only**. No Python.

---

## What this repo does

The test file makes fake users visit a website and increases the load every **3 minutes**.

Default load plan:

| Time | Users |
|---|---:|
| 0-3 minutes | 1 user |
| 3-6 minutes | 5 users |
| 6-9 minutes | 10 users |
| 9-12 minutes | 15 users |
| 12-15 minutes | goes back to 0 users |

You can change these numbers inside:

```text
tests/simple-load-test.js
```

---

## Where to put your website

Open this file:

```text
tests/simple-load-test.js
```

Find this line:

```js
const WEBSITE_URL = __ENV.WEBSITE_URL || 'https://test.k6.io';
```

Replace `https://test.k6.io` with your own website:

```js
const WEBSITE_URL = __ENV.WEBSITE_URL || 'https://your-website.com';
```

Or keep the file the same and run the test like this:

```bash
k6 run -e WEBSITE_URL=https://your-website.com tests/simple-load-test.js
```

Example:

```bash
k6 run -e WEBSITE_URL=https://myshop.com tests/simple-load-test.js
```

---

# Install k6

After installing k6, check that it works:

```bash
k6 version
```

---

## macOS

Using Homebrew:

```bash
brew install k6
```

Upgrade:

```bash
brew upgrade k6
```

---

## Windows

Using Windows Package Manager:

```powershell
winget install k6 --source winget
```

Or using Chocolatey:

```powershell
choco install k6
```

Upgrade with winget:

```powershell
winget upgrade k6
```

Upgrade with Chocolatey:

```powershell
choco upgrade k6
```

---

## Linux: Debian / Ubuntu

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

Using `dnf`:

```bash
sudo dnf install https://dl.k6.io/rpm/repo.rpm
sudo dnf install k6
```

Upgrade:

```bash
sudo dnf upgrade k6
```

For older systems that use `yum`, replace `dnf` with `yum`.

---

## Docker

Pull the official k6 image:

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

Run with your own website:

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

# Run the load test

Run the test with the default demo website:

```bash
k6 run tests/simple-load-test.js
```

Run it with your own website:

```bash
k6 run -e WEBSITE_URL=https://your-website.com tests/simple-load-test.js
```

---

# Understand the test file

The most important part is this:

```js
export const options = {
  stages: [
    { duration: '3m', target: 1 },
    { duration: '3m', target: 5 },
    { duration: '3m', target: 10 },
    { duration: '3m', target: 15 },
    { duration: '3m', target: 0 },
  ],
};
```

This means:

- First 3 minutes: go to **1 user**
- Next 3 minutes: go to **5 users**
- Next 3 minutes: go to **10 users**
- Next 3 minutes: go to **15 users**
- Last 3 minutes: go back to **0 users**

To make the test stronger, change the targets:

```js
{ duration: '3m', target: 50 }
```

To make the test shorter, change the duration:

```js
{ duration: '1m', target: 5 }
```

---

# What k6 results mean

| Metric | Meaning |
|---|---|
| `http_req_duration` | How long requests took |
| `http_req_failed` | Percentage of failed requests |
| `checks` | Whether your checks passed |
| `vus` | Virtual users currently running |
| `iterations` | How many times the script ran |

This repo includes simple thresholds:

```js
thresholds: {
  http_req_failed: ['rate<0.05'],
  http_req_duration: ['p(95)<1000'],
}
```

Meaning:

- Fewer than **5%** of requests should fail
- **95%** of requests should finish under **1000ms**

---

# Important safety note

Only run load tests against:

- your own website
- your own API
- a local app
- a demo/testing website
- a company system where you have permission

Do **not** run load tests against random websites.

---

# Upload this repo to GitHub

## Option 1: GitHub website

1. Go to GitHub.
2. Click **New repository**.
3. Name it:

```text
k6-javascript-load-testing-starter
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
git commit -m "Initial k6 JavaScript load testing starter"
git branch -M main
```

Then create a new empty GitHub repo and connect it:

```bash
git remote add origin https://github.com/YOUR-USERNAME/k6-javascript-load-testing-starter.git
git push -u origin main
```

---

# Useful links

- k6 docs: https://grafana.com/docs/k6/latest/
- k6 install docs: https://grafana.com/docs/k6/latest/set-up/install-k6/
- k6 environment variables: https://grafana.com/docs/k6/latest/using-k6/environment-variables/
- k6 running tests: https://grafana.com/docs/k6/latest/get-started/running-k6/

---

## License

MIT License.
