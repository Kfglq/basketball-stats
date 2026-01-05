// src/pages/NotFound.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import NotFound from './NotFound.vue';

describe('NotFound.vue', () => {
  it('應該渲染 Not Found 標題', () => {
    const wrapper = mount(NotFound);
    
    const h1 = wrapper.find('h1');
    expect(h1.exists()).toBe(true);
    expect(h1.text()).toBe('Not Found');
  });

  it('應該符合快照 (Snapshot Testing)', () => {
    const wrapper = mount(NotFound);
    expect(wrapper.html()).toMatchSnapshot();
  });
});
