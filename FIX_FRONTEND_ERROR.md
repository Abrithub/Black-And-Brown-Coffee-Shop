# Fix Frontend Error - Step by Step Guide

## Problem
The error shows: `Failed to resolve import "axios"` - This means the dependencies are not installed.

## Solution Steps

### Step 1: Stop the Current Dev Server
- In your PowerShell terminal, press `Ctrl + C` to stop the running `npm run dev` command
- Wait for it to stop completely

### Step 2: Navigate to Client Directory (if not already there)
```bash
cd client
```

### Step 3: Install Dependencies
```bash
npm install
```
This will install:
- `axios` (for API calls)
- `react-router-dom` (for routing)
- All other dependencies listed in `package.json`

**Wait for installation to complete** - This may take 1-2 minutes

### Step 4: Verify Installation
After `npm install` completes, you should see:
- `node_modules` folder created/updated
- No errors in the terminal
- Message like "added X packages"

### Step 5: Start Dev Server Again
```bash
npm run dev
```

### Step 6: Check for Success
You should see:
```
VITE v6.3.6  ready in X ms
➜  Local:   http://localhost:5174/
```
**No errors about axios or react-router-dom**

---

## Complete Command Sequence

```bash
# 1. Stop current server (Ctrl+C if still running)

# 2. Go to client directory
cd client

# 3. Install dependencies
npm install

# 4. Start dev server
npm run dev
```

---

## If You Still Get Errors

### Check if packages are in package.json:
```bash
cat package.json
```
You should see `axios` and `react-router-dom` in the dependencies section.

### If packages are missing from package.json:
The packages should already be there, but if not, they need to be added.

### Clear cache and reinstall:
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

---

## Expected Result

After following these steps:
✅ No "Failed to resolve import" errors
✅ Dev server starts successfully
✅ Frontend loads at http://localhost:5174/
✅ All imports work correctly


