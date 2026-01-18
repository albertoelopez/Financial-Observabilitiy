/**
 * Eval: Expense Analysis Quality
 *
 * Tests the LLM's ability to:
 * 1. Extract expense items from documents
 * 2. Calculate accurate average prices
 * 3. Generate relevant optimization suggestions
 */

import { langfuse, flush } from '../../lib/langfuse.js';
import api, { setAuthToken } from '../../lib/fsuite.js';
import dotenv from 'dotenv';
dotenv.config();

// Test cases with expected outputs
const testCases = [
  {
    name: 'Basic expense extraction',
    input: {
      documentText: `
        Fixed costs:
        Internet Service - $150/month
        Cloud Hosting - $500/month
        Software Licenses - $200/month
      `
    },
    expected: {
      minItems: 3,
      expectedTitles: ['Internet', 'Cloud', 'Software'],
      priceRange: { min: 100, max: 600 }
    }
  }
];

async function runEval(testCase) {
  const trace = langfuse.trace({
    name: 'expense-analysis-eval',
    metadata: { testCase: testCase.name }
  });

  const span = trace.span({
    name: 'eval-run',
    input: testCase.input
  });

  try {
    // TODO: Call the actual API endpoint once authenticated
    // const response = await api.post('/file/analyze', testCase.input);

    // For now, log the test case
    console.log(`Running: ${testCase.name}`);
    console.log(`Input: ${JSON.stringify(testCase.input, null, 2)}`);
    console.log(`Expected: ${JSON.stringify(testCase.expected, null, 2)}`);

    // Score the result
    trace.score({
      name: 'eval-placeholder',
      value: 1,
      comment: 'Placeholder - implement actual scoring'
    });

    span.end({ output: { status: 'placeholder' } });

  } catch (error) {
    span.end({
      output: { error: error.message },
      level: 'ERROR'
    });

    trace.score({
      name: 'eval-error',
      value: 0,
      comment: error.message
    });
  }

  return trace;
}

async function main() {
  console.log('Starting Expense Analysis Evals...\n');

  for (const testCase of testCases) {
    await runEval(testCase);
  }

  await flush();
  console.log('\nEvals complete. Check Langfuse dashboard for results.');
}

main().catch(console.error);
