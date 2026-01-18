# Financial Observability

Langfuse-powered evals and observability for [Financial Suite](https://f-suite.com).

## Setup

```bash
npm install
cp .env.example .env
# Add your Langfuse keys to .env
```

## Structure

```
financial-observability/
├── lib/
│   ├── langfuse.js    # Langfuse client
│   └── fsuite.js      # Financial Suite API client
├── evals/
│   └── f_suite/       # Evals for f-suite.com
│       └── expense_analysis.js
├── datasets/          # Test datasets (coming soon)
└── .env.example
```

## Running Evals

```bash
# Run all evals
npm run eval

# Run specific eval
npm run eval:expense
```

## What's Being Evaluated

1. **Expense Analysis** - LLM accuracy in extracting expenses from documents
2. **Optimization Suggestions** - Quality of cost-saving recommendations
3. **Chat Responses** - Helpfulness of the AI assistant

## Langfuse Dashboard

View traces and scores at: https://cloud.langfuse.com
