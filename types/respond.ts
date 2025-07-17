import type * as z from 'zod';

export interface Respond {
  status: 'success' | 'error';
  message?: string;
  result?: boolean;
  legalAge?: boolean;
  error?: Error | string;
  issues?: z.core.$ZodIssue[];
}
