import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function isEdgeOrWorker(): boolean {
  return (
    typeof (globalThis as unknown as { WebSocketPair?: unknown }).WebSocketPair !== 'undefined' ||
    (typeof process !== 'undefined' && process.env.NEXT_RUNTIME === 'edge')
  );
}

export function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  if (isEdgeOrWorker()) {
    console.warn(
      '[prisma] Direct Prisma Client with node-postgres adapter is not supported in edge/worker isolates. Use @neondatabase/serverless HTTP queries instead.'
    );
  }

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('[prisma] DATABASE_URL environment variable is not configured.');
  }

  const pool =
    globalForPrisma.pool ??
    new Pool({
      connectionString,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.pool = pool;
  }

  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

  globalForPrisma.prisma = client;
  return client;
}

// Lazy proxy so that importing `prisma` at top-level never executes database connection
// or fails before environment variables are injected into the runtime request context.
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop: string | symbol, receiver) {
    const client = getPrismaClient();
    const value = Reflect.get(client, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

export default prisma;
