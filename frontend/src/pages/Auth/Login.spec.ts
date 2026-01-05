// src/pages/Auth/Login.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import Login from './Login.vue';

vi.mock('naive-ui', async (importOriginal) => {
  const actual = await importOriginal<typeof import('naive-ui')>();
  return {
    ...actual,
    NFlex: { template: '<div><slot /></div>' },
    NText: { template: '<span><slot /></span>' },
    NButton: { 
      name: 'NButton',
      props: ['type', 'size'],
      template: '<button @click="$emit(\'click\')"><slot /></button>' 
    },
  };
});

vi.mock('@/components/ChangeTopicColor.vue', () => ({
  default: { name: 'ChangeTopicColor', template: '<div class="mock-color-picker"></div>' }
}));

const mockPush = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: mockPush
  })),
}));

const globalMocks = {
  $router: {
    push: mockPush
  }
};

describe('Login.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('應該正確渲染歡迎文字與色彩切換元件', () => {
    const wrapper = mount(Login, {
      global: { mocks: globalMocks }
    });

    expect(wrapper.text()).toContain('歡迎使用');
    expect(wrapper.findComponent({ name: 'ChangeTopicColor' }).exists()).toBe(true);
  });

  it('點擊「進入首頁」按鈕時應跳轉至 Home 頁面', async () => {
    const wrapper = mount(Login, {
      global: { mocks: globalMocks }
    });

    const loginButton = wrapper.find('button');
    await loginButton.trigger('click');
    expect(mockPush).toHaveBeenCalledWith({ name: 'Home' });
  });

  it('按鈕應具有正確的樣式屬性', () => {
    const wrapper = mount(Login, {
      global: { mocks: globalMocks }
    });
    
    const button = wrapper.getComponent({ name: 'NButton' });
    expect(button.props('type')).toBe('primary');
    expect(button.props('size')).toBe('large');
  });
});
