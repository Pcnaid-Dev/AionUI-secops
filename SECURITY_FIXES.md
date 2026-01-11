# Security Fixes and Recommendations

## Applied Fixes

### 1. ✅ FIXED: Removed eval() Usage (Critical)

**Issue:** Use of `eval('require')` in UUID generation function  
**Location:** `src/common/utils.ts:27`  
**Risk Level:** Medium (Code Injection potential)  
**Fix Applied:** Replaced with safe `require()` statement

**Before:**
```typescript
const cryptoModule = eval('require')('crypto');
```

**After:**
```typescript
let nodeCrypto: typeof import('crypto') | null = null;
try {
  nodeCrypto = require('crypto');
} catch {
  // Browser environment or crypto not available
}
```

**Status:** ✅ Fixed and committed

---

### 2. ✅ FIXED: Updated MCP SDK to Fix ReDoS Vulnerability (High Priority)

**Issue:** ReDoS (Regular Expression Denial of Service) vulnerability in @modelcontextprotocol/sdk  
**CVE:** GHSA-8r9q-7v3j-jr4g  
**Severity:** High  
**Affected Version:** <1.25.2

**Fix Applied:** Updated package.json dependency

**Before:**
```json
"@modelcontextprotocol/sdk": "^1.20.0"
```

**After:**
```json
"@modelcontextprotocol/sdk": "^1.25.2"
```

**Status:** ✅ Fixed in package.json (requires npm install to apply)

---

## Recommended Fixes (To Be Applied)

### 3. ⚠️ RECOMMENDED: Update react-router-dom to Fix CSRF Vulnerability

**Issue:** CSRF vulnerability in react-router Action/Server Action Request Processing  
**CVE:** GHSA-h5cw-625j-3rxh  
**Severity:** Moderate (CVSS 6.5)  
**Affected Version:** <7.10.0

**Recommended Action:**
```bash
npm install react-router-dom@^7.10.0
```

**Status:** ⏳ Pending (update recommended in package.json)

---

### 4. ⚠️ RECOMMENDED: Update qs to Fix DoS Vulnerability

**Issue:** qs's arrayLimit bypass allows DoS via memory exhaustion  
**CVE:** GHSA-6rw7-vpxm-498p  
**Severity:** High (CVSS 7.5)  
**Affected Version:** <6.14.1

**Note:** This is a transitive dependency through express and webpack-dev-server

**Recommended Action:**
```bash
# This will be fixed automatically when dependencies update their qs version
# Or add to package.json overrides:
"overrides": {
  "qs": "^6.14.1"
}
```

**Status:** ⏳ Pending (requires dependency updates)

---

## Additional Security Recommendations

### 5. Enable HTTPS for Remote Access

**Priority:** High  
**Scope:** WebUI Remote Mode

**Current State:**
- Remote access uses HTTP by default
- HTTPS is recommended in documentation but not enforced

**Recommendation:**
Add configuration option to enforce HTTPS when `--remote` flag is used:

```typescript
// src/webserver/config/constants.ts
COOKIE: {
  OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || allowRemote,
    sameSite: 'strict',
  },
}
```

**Benefits:**
- Protects credentials in transit
- Prevents man-in-the-middle attacks
- Industry best practice for remote access

---

### 6. Add IP Whitelist for Remote Access

**Priority:** Medium  
**Scope:** WebUI Remote Mode

**Recommendation:**
Add environment variable to restrict remote access to specific IP ranges:

```bash
# Example usage
AIONUI_ALLOWED_IPS="192.168.1.0/24,10.0.0.0/8" npm run webui:remote
```

**Implementation:**
Add middleware to check incoming request IP against whitelist.

---

### 7. Implement Automated Dependency Scanning

**Priority:** Medium  
**Scope:** CI/CD Pipeline

**Recommendation:**
Add GitHub Actions workflow to automatically scan dependencies:

```yaml
# .github/workflows/security-scan.yml
name: Security Scan
on:
  push:
    branches: [main, develop]
  pull_request:
  schedule:
    - cron: '0 0 * * 0'  # Weekly

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm audit --audit-level=moderate
```

---

### 8. Add Security Policy File

**Priority:** Low  
**Scope:** Repository Documentation

**Recommendation:**
Create `SECURITY.md` file with:
- Supported versions
- Vulnerability reporting process
- Security contact information
- Expected response times

---

## Dependency Vulnerability Summary

| Package | Current | Fixed | Severity | CVE | Status |
|---------|---------|-------|----------|-----|--------|
| @modelcontextprotocol/sdk | 1.20.0 | 1.25.2 | High | GHSA-8r9q-7v3j-jr4g | ✅ Fixed |
| react-router-dom | 7.8.0 | 7.10.0 | Moderate | GHSA-h5cw-625j-3rxh | ⏳ Recommended |
| qs (transitive) | <6.14.1 | 6.14.1 | High | GHSA-6rw7-vpxm-498p | ⏳ Recommended |

---

## Post-Fix Testing Checklist

After applying fixes, verify:

- [ ] Application builds successfully
- [ ] Unit tests pass
- [ ] UUID generation works in both browser and Node.js environments
- [ ] Authentication flow works correctly
- [ ] Remote access (WebUI) functions properly
- [ ] No new security warnings from CodeQL
- [ ] npm audit shows reduced vulnerability count

---

## Commands to Apply All Fixes

```bash
# 1. Update package-lock.json with fixed versions
npm install

# 2. Run security audit
npm audit

# 3. Build the application
npm run build

# 4. Run tests
npm test

# 5. Verify CodeQL scan
# (This will be done automatically in CI/CD)
```

---

## Notes

- All critical security issues have been addressed
- High-priority fixes have been applied or documented
- Medium and low-priority items are optimization recommendations
- Regular security audits should be scheduled quarterly
- Keep dependencies updated with automated tools like Dependabot

---

**Last Updated:** January 11, 2026  
**Next Review:** April 11, 2026 (3 months)
