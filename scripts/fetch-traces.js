import Langfuse from 'langfuse';
import dotenv from 'dotenv';

dotenv.config();

const langfuse = new Langfuse({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  baseUrl: process.env.LANGFUSE_BASE_URL || 'https://cloud.langfuse.com',
});

async function fetchTraces() {
  try {
    console.log('Fetching recent traces from Langfuse...\n');

    const traces = await langfuse.fetchTraces({
      limit: 10,
      orderBy: 'timestamp',
      orderDirection: 'desc',
    });

    if (!traces.data || traces.data.length === 0) {
      console.log('No traces found.');
      return;
    }

    console.log(`Found ${traces.data.length} traces:\n`);

    for (const trace of traces.data) {
      console.log('='.repeat(60));
      console.log(`Trace ID: ${trace.id}`);
      console.log(`Name: ${trace.name || 'unnamed'}`);
      console.log(`Timestamp: ${trace.timestamp}`);
      console.log(`User ID: ${trace.userId || 'none'}`);
      console.log(`Session ID: ${trace.sessionId || 'none'}`);
      console.log(`Input: ${JSON.stringify(trace.input)?.substring(0, 200)}...`);
      console.log(`Output: ${JSON.stringify(trace.output)?.substring(0, 200)}...`);
      console.log(`Metadata: ${JSON.stringify(trace.metadata)}`);

      if (trace.observations && trace.observations.length > 0) {
        console.log(`\nObservations (${trace.observations.length}):`);
        for (const obs of trace.observations) {
          console.log(`  - ${obs.type}: ${obs.name} (${obs.model || 'no model'})`);
          if (obs.usage) {
            console.log(`    Tokens: ${obs.usage.totalTokens} (in: ${obs.usage.promptTokens}, out: ${obs.usage.completionTokens})`);
          }
          if (obs.calculatedTotalCost) {
            console.log(`    Cost: $${obs.calculatedTotalCost.toFixed(6)}`);
          }
        }
      }
      console.log('');
    }

  } catch (error) {
    console.error('Error fetching traces:', error.message);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

fetchTraces();
