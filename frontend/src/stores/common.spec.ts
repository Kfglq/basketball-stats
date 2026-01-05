// src/stores/common.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useCommonStore } from './common';

describe('Common Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('初始狀態應正確', () => {
    const store = useCommonStore();
    expect(store.darkTheme).toBe(false);
    expect(store.isLoading).toBe(false);
    expect(store.isReady).toBe(true);
  });

  it('toggleTheme 應能切換主題狀態', () => {
    const store = useCommonStore();
    expect(store.darkTheme).toBe(false);
    
    store.toggleTheme(); // 執行這行會覆蓋第 18 行
    expect(store.darkTheme).toBe(true);
    
    store.toggleTheme();
    expect(store.darkTheme).toBe(false);
  });

  it('setPrimaryColor 應正確更新顏色', () => {
    const store = useCommonStore();
    const newColor = '#ff0000';
    store.setPrimaryColor(newColor);
    expect(store.primaryColor).toBe(newColor);
  });

  it('isReady 應根據 loading 和 error 狀態正確聯動', () => {
    const store = useCommonStore();
    
    store.setLoading(true);
    expect(store.isReady).toBe(false);
    
    store.setLoading(false);
    store.setError('Error occurred');
    expect(store.isReady).toBe(false);
    
    store.setError(null);
    expect(store.isReady).toBe(true);
  });
});
