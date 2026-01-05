// src/layouts/AuthLayout.spec.ts
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import AuthLayout from './AuthLayout.vue';

// Mock Naive UI
vi.mock('naive-ui', () => ({
  NFlex: { name: 'NFlex', template: '<div class="mock-flex"><slot /></div>' }
}));

describe('AuthLayout.vue', () => {
  it('應該正確渲染容器並包含 router-view', () => {
    const wrapper = mount(AuthLayout, {
      global: {
        stubs: { 'router-view': true }
      }
    });

    expect(wrapper.classes()).toContain('auth-layout');
    expect(wrapper.findComponent({ name: 'NFlex' }).exists()).toBe(true);
    expect(wrapper.find('router-view-stub').exists()).toBe(true);
  });
});
