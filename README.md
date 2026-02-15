# Silver&Fit Playwright Test Suite

Comprehensive end-to-end test suite for [silverandfit.com](https://www.silverandfit.com) using Playwright with TypeScript.

## 📁 Project Structure

```
PlaywrightMCP/
├── tests/
│   ├── auth.setup.ts                    # Authentication setup script
│   ├── member-dashboard.authenticated.spec.ts
│   ├── BDD tests/
│   │   ├── premium-fitness-enrollment-faq.spec.ts
│   │   └── eligibility-check.spec.ts
│   ├── broken link tests/
│   │   └── broken-links.spec.ts         # Reference link checker
│   ├── e2e/
│   │   ├── complete-user-journeys.spec.ts
│   │   ├── fitness-center-search.spec.ts
│   │   ├── information-pages.spec.ts
│   │   ├── member-login.spec.ts
│   │   └── new-user-registration.spec.ts
│   ├── e2e auth tests/
│   │   ├── dashboard.authenticated.spec.ts
│   │   ├── digital-workouts.authenticated.spec.ts
│   │   ├── fitness-center-search.authenticated.spec.ts
│   │   ├── main-navigation.authenticated.spec.ts
│   │   ├── my-account.authenticated.spec.ts
│   │   └── session-management.authenticated.spec.ts
│   └── HomePage/
│       ├── homepage-content.spec.ts
│       ├── homepage-links.spec.ts
│       ├── homepage-navigation.spec.ts
│       └── homepage-responsive.spec.ts
├── .auth/                               # Stored authentication state (gitignored)
├── broken-link-reports/                 # Broken link checker HTML reports
├── playwright-report/                   # HTML test reports
├── test-results/                        # Test artifacts and traces
├── playwright.config.ts                 # Playwright configuration
├── .env                                 # Environment variables (gitignored)
├── .env.example                         # Template for environment variables
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Access to Silver&Fit test credentials

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd PlaywrightMCP
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

### Configuration

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your test credentials:
   ```env
   SILVERANDFIT_USERNAME=your-username
   SILVERANDFIT_PASSWORD=your-password
   ```

   ⚠️ **IMPORTANT**: Never commit the `.env` file to version control!

## 🧪 Running Tests

### Run All Tests
```bash
npx playwright test
```

### Run Non-Authenticated Tests Only
```bash
npx playwright test --project=chromium
```

### Run Authenticated Tests Only
```bash
npx playwright test --project=chromium-authenticated
```

### Run Specific Test File
```bash
npx playwright test tests/e2e/fitness-center-search.spec.ts
```

### Run Tests in UI Mode
```bash
npx playwright test --ui
```

### Run Tests in Headed Mode (See Browser)
```bash
npx playwright test --headed
```

### Run Tests with Debug Mode
```bash
npx playwright test --debug
```

## 📊 Test Reports

### View HTML Report
```bash
npx playwright show-report
```

The report opens automatically after test runs and includes:
- Test results summary
- Screenshots on failure
- Trace viewer for debugging
- Video recordings (if enabled)

## 🔐 Authentication Architecture

This project uses Playwright's **storageState** pattern for efficient authenticated testing:

1. **Setup Project** (`auth.setup.ts`): Runs once before authenticated tests, logs in, and saves session state to `.auth/user.json`

2. **Authenticated Tests**: Reuse the saved session state, eliminating repeated logins

3. **Non-Authenticated Tests**: Run independently without requiring login

### Project Configuration

| Project | Description | Auth Required |
|---------|-------------|---------------|
| `setup` | Authentication setup | - |
| `chromium` | Non-authenticated tests | No |
| `chromium-authenticated` | Authenticated tests | Yes |

## 📋 Test Categories

### BDD Tests
Behavior-driven tests for specific user scenarios:
- Premium fitness enrollment FAQ
- Eligibility check flow

### E2E Tests (Public)
End-to-end tests for public pages:
- Homepage content and navigation
- Fitness center search
- User registration flow
- Member login

### E2E Auth Tests
Authenticated user journey tests:
- Dashboard features and navigation
- Digital workouts library
- Fitness center search (authenticated)
- My Account pages
- Session management

### Broken Link Tests
Reference link validation for blog content:
- Scans blog listing pages to discover articles
- Extracts reference links from the "References" section of each article
- Validates all external reference links (academic citations, sources)
- Generates detailed HTML reports with broken, timeout, and working links

## ⚙️ Configuration Options

Key settings in `playwright.config.ts`:

| Setting | Value | Description |
|---------|-------|-------------|
| `timeout` | 60000ms | Test timeout (60 seconds) |
| `navigationTimeout` | 45000ms | Page navigation timeout |
| `actionTimeout` | 15000ms | User action timeout |
| `retries` | 1 (local), 2 (CI) | Retry failed tests |
| `workers` | 2 (local), 1 (CI) | Parallel workers |

## 🛠️ Best Practices

This test suite follows Playwright best practices:

- ✅ **Role-based locators**: Using `getByRole()`, `getByText()`, `getByLabel()`
- ✅ **Auto-retrying assertions**: Using `expect()` with built-in retries
- ✅ **No hardcoded waits**: Relying on Playwright's auto-waiting
- ✅ **Independent tests**: Each test runs in isolation
- ✅ **Secure credentials**: Environment variables via dotenv
- ✅ **Descriptive test names**: Clear, behavior-focused titles

## 🐛 Troubleshooting

### Tests Timing Out
- The Silver&Fit website may be slow at times
- Increase timeouts in `playwright.config.ts` if needed
- Run with fewer workers: `--workers=1`

### Authentication Failing
- Verify credentials in `.env` file
- Check if login page structure has changed
- Delete `.auth/user.json` and re-run setup

### View Test Traces
```bash
npx playwright show-trace test-results/<test-folder>/trace.zip
```

## 📝 Adding New Tests

1. Create a new `.spec.ts` file in the appropriate directory
2. For authenticated tests, add `.authenticated.` to the filename
3. Use `test.use({ storageState: '.auth/user.json' })` for auth tests
4. Run and iterate until tests pass:
   ```bash
   npx playwright test <your-test-file> --headed
   ```

## 🔄 CI/CD Integration

The project is configured for CI environments:
- Automatic retry on failures
- Single worker for stability
- HTML report generation
- Trace capture on first retry

Example GitHub Actions workflow:
```yaml
- name: Run Playwright tests
  run: npx playwright test
  env:
    SILVERANDFIT_USERNAME: ${{ secrets.SILVERANDFIT_USERNAME }}
    SILVERANDFIT_PASSWORD: ${{ secrets.SILVERANDFIT_PASSWORD }}
```

## � Broken Link Checker

The broken link checker scans blog articles and validates reference links in the "References" section.

### Basic Usage

```bash
# Run with default settings (5 listing pages = ~50 articles)
npx playwright test "broken link tests"

# Run against Silver&Fit blog
TARGET_URL="https://blog.silverandfit.com/" npx playwright test "broken link tests"
```

### Configuration Options

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `TARGET_URL` | `https://blog.silverandfit.com/` | Blog URL to scan |
| `MAX_PAGES` | `5` | Number of listing pages (each has ~10 articles). Set to `0` for unlimited. |
| `LINK_TIMEOUT` | `10000` | Timeout per link check (milliseconds) |
| `MAX_RETRIES` | `2` | Retry attempts for failed/timeout links |

### Examples

```bash
# Scan 3 listing pages (~30 articles)
TARGET_URL="https://blog.silverandfit.com/" MAX_PAGES=3 npx playwright test "broken link tests"

# Scan all pages (unlimited) with longer timeout
TARGET_URL="https://blog.silverandfit.com/" MAX_PAGES=0 LINK_TIMEOUT=15000 npx playwright test "broken link tests"

# Run with verbose output
TARGET_URL="https://blog.silverandfit.com/" MAX_PAGES=5 npx playwright test "broken link tests" --reporter=list
```

### How It Works

1. **Phase 1: Discover Articles** - Scans listing pages and identifies blog article URLs
2. **Phase 2: Extract References** - Visits each article and extracts links from the "References" section
3. **Phase 3: Check Links** - Validates each unique reference link with retry logic

### HTML Reports

Reports are saved to `broken-link-reports/reference-links-report-[timestamp].html` and include:

- ❌ **Broken Links** - Links returning 4xx/5xx status codes
- ⏱️ **Timeout Links** - Links that didn't respond in time
- 🔀 **Redirected Links** - Links that redirect to a different URL
- 📖 **Articles Scanned** - List of all articles checked
- ✅ **Working Links** - All successfully validated links

### Notes

- Some academic links (e.g., `doi.org`) may return 403 errors due to bot blocking
- The test uses soft assertions, so it continues checking all links even when broken ones are found
- Reports include which article each broken link was found in for easy remediation

## �📄 License

[Add your license here]

## 👥 Contributing

[Add contribution guidelines here]
