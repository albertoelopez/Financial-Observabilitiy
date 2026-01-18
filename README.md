# Financial Observability

Langfuse-powered evals and E2E testing framework.

## Setup

```bash
npm install
npx playwright install chromium
cp .env.example .env
# Add your Langfuse keys and test credentials to .env
```

## Structure

```
financial-observability/
├── lib/
│   ├── langfuse.js    # Langfuse client
│   └── fsuite.js      # Financial Suite API client
├── evals/
│   └── f_suite/       # Script-based evals
│       └── expense_analysis.js
├── e2e/
│   ├── helpers/
│   │   └── langfuse.ts
│   ├── homepage.spec.ts
│   ├── auth.spec.ts
│   └── optimizer.spec.ts
└── .env.example
```

## Running E2E Tests

```bash
# Run all tests (against localhost:3000)
npm test

# Run with UI mode
npm run test:ui

# Run headed (see browser)
npm run test:headed

# Run against production
npm run test:prod

# Run against local dev
npm run test:local
```

## Running Script Evals

```bash
# Run all evals
npm run eval

# Run specific eval
npm run eval:expense
```

## What's Being Evaluated

1. **Homepage & Navigation** - UI loads correctly, navigation works
2. **Authentication** - Signin flow, error handling
3. **Optimizer Upload** - File upload UI, format validation
4. **Optimizer Results** - AI analysis display, error states
5. **Expense Analysis** - LLM accuracy in extracting expenses
6. **Chat Responses** - AI assistant helpfulness

## Langfuse Integration

All E2E tests report traces and scores to Langfuse:
- View traces at: https://cloud.langfuse.com
- Each test creates a trace with pass/fail scores
- Screenshots saved on failure for debugging

## Environment Variables

```
LANGFUSE_SECRET_KEY    # Langfuse secret key
LANGFUSE_PUBLIC_KEY    # Langfuse public key
TEST_USER_EMAIL        # (Optional) Test account email
TEST_USER_PASSWORD     # (Optional) Test account password
BASE_URL               # Target URL (default: http://localhost:3000)
```
