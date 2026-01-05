// src/components/Badge.spec.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Badge from './Badge.vue';

describe('Badge.vue 完整邏輯與覆蓋率測試', () => {
  
  describe('Default 類型 - 背景顏色分支', () => {
    const defaultCases = [
      { data: 90, expected: 'rgb(0, 170, 0)' },   // #00AA00
      { data: 80, expected: 'rgb(0, 119, 0)' },   // #007700
      { data: 70, expected: 'rgb(204, 153, 0)' }, // #CC9900
      { data: 60, expected: 'rgb(221, 68, 0)' },  // #DD4400
      { data: 50, expected: 'rgb(153, 0, 0)' },   // #990000
    ];

    defaultCases.forEach(({ data, expected }) => {
      it(`當 data 為 ${data} 時，backgroundColor 應為 ${expected}`, () => {
        const wrapper = mount(Badge, { props: { data, type: 'default' } });
        const el = wrapper.element as HTMLElement;
        expect(el.style.backgroundColor).toBe(expected);
        expect(wrapper.text()).toBe(data.toString());
      });
    });
  });

  describe('Special 類型 - 漸層與陰影分支', () => {
    const specialCases = [
      { data: 99, hasShadow: false, desc: '頂級漸層 (>=99)' },
      { data: 97, hasShadow: true,  shadowColor: '#f9a205', desc: '金光漸層 (>=97)' },
      { data: 95, hasShadow: true,  shadowColor: '#ff96df', desc: '粉紅漸層 (>=95)' },
      { data: 92, hasShadow: false, desc: '青藍漸層 (>=92)' },
      { data: 90, hasShadow: false, desc: '紫色漸層 (>=90)' },
      { data: 87, hasShadow: false, desc: '鮮紅漸層 (>=87)' },
      { data: 84, hasShadow: false, desc: '深藍漸層 (>=84)' },
      { data: 80, hasShadow: false, desc: '嫩綠漸層 (>=80)' },
      { data: 75, hasShadow: false, desc: '棕黃漸層 (>=75)' },
      { data: 70, hasShadow: false, desc: '灰色漸層 (>=70)' },
      { data: 60, hasShadow: false, desc: '預設橘黑漸層 (<70)' },
    ];

    specialCases.forEach(({ data, hasShadow, shadowColor, desc }) => {
      it(`測試 [${desc}]: data=${data}`, () => {
        const wrapper = mount(Badge, { props: { data, type: 'special' } });
        const el = wrapper.element as HTMLElement;
        
        expect(el.style.background).toContain('linear-gradient');
        
        if (hasShadow) {
          expect(el.style.boxShadow).toContain(shadowColor);
        } else {
          expect(el.style.boxShadow).toBe('none');
        }
      });
    });
  });

  describe('邊界與防禦性測試', () => {
    it('若傳入 undefined，應觸發 withDefaults 使用預設值 0', () => {
      const wrapper = mount(Badge, { props: { data: undefined as any } });
      expect(wrapper.text()).toBe('0');
      const el = wrapper.element as HTMLElement;
      expect(el.style.backgroundColor).toBe('rgb(153, 0, 0)');
    });

    it('應能正確渲染 props 傳入的 type', () => {
      const wrapper = mount(Badge, { props: { data: 90, type: 'special' } });
      expect(wrapper.props().type).toBe('special');
    });
  });
});
