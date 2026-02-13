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

## 📄 License

[Add your license here]

## 👥 Contributing

[Add contribution guidelines here]
