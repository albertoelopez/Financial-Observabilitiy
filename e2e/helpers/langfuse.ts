import { Langfuse } from 'langfuse';
import dotenv from 'dotenv';
dotenv.config();

export const langfuse = new Langfuse({
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  baseUrl: process.env.LANGFUSE_BASE_URL || 'https://cloud.langfuse.com',
});

export const createTrace = (name: string, metadata?: Record<string, unknown>) => {
  return langfuse.trace({
    name,
    metadata,
  });
};

export const flush = () => langfuse.flushAsync();
