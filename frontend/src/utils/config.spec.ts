// src/utils/config.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Config Utils', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('當 host 為 localhost 時，應包含 port', async () => {
    vi.stubEnv('VITE_API_HOST', 'localhost');
    vi.stubEnv('VITE_API_PORT', '8080');
    const config = (await import('./config')).default;
    expect(config.api).toContain(':8080');
  });

  it('當 host 不是 localhost 時，不應顯示 port', async () => {
    vi.stubEnv('VITE_API_HOST', 'api.mysite.com');
    const config = (await import('./config')).default;
    expect(config.api).not.toContain(':80');
  });
});
