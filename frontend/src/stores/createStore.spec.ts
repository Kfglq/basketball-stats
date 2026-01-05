// src/stores/createStore.spec.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { createStore } from './createStore';

describe('createStore Factory', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('應正確生成 State 與 Setter', () => {
    const useTestStore = createStore('test', { count: 0, name: 'Guest' });
    const store = useTestStore();

    expect(store.count).toBe(0);
    
    // 檢查自動生成的 setter
    store.setCount(10);
    expect(store.count).toBe(10);
    
    store.setName('Admin');
    expect(store.name).toBe('Admin');
  });
});
