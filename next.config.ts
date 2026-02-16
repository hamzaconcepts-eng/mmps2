import type { NextConfig } from 'next';
import { resolve } from 'path';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  // Resolve to the main repo root where node_modules lives (needed for git worktrees)
  outputFileTracingRoot: resolve(__dirname, '../../../'),
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default withNextIntl(nextConfig);
