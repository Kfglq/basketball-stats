// src/utils/request.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import httpClient from './request';

// 模擬 axios
vi.mock('axios', () => {
  return {
    default: {
      create: vi.fn().mockReturnThis(),
      request: vi.fn().mockResolvedValue({ status: 200, data: 'success' })
    }
  };
});

describe('HttpClient request helper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('GET 請求應將資料放入 params 欄位', async () => {
    const spy = vi.spyOn(axios.create(), 'request');
    await httpClient.get('/test', { id: 1 });
    expect(spy.mock.calls[0][0].method).toBe('GET');
    expect(spy.mock.calls[0][0].params).toEqual({ id: 1 });
  });

  it('POST 請求應將資料放入 data 欄位', async () => {
    const spy = vi.spyOn(axios.create(), 'request');
    await httpClient.post('/test', { name: 'LeBron' });
    expect(spy.mock.calls[0][0].method).toBe('POST');
  });

  it('PUT 請求應將資料放入 data 欄位', async () => {
    const spy = vi.spyOn(axios.create(), 'request');
    const mockData = { id: 1, name: 'Updated LeBron' };
    await httpClient.put('/test/1', mockData);
    const calledOption = spy.mock.calls[0][0];
    expect(calledOption.method).toBe('PUT');
    expect(calledOption.data).toEqual(mockData);
  });

  it('DELETE 請求應將資料放入 params 欄位', async () => {
    const spy = vi.spyOn(axios.create(), 'request');
    const mockParams = { force: true };
    await httpClient.delete('/test/1', mockParams);
    const calledOption = spy.mock.calls[0][0];
    expect(calledOption.method).toBe('DELETE');
    expect(calledOption.params).toEqual(mockParams);
  });

  it('當狀態碼非 2xx 時應拋出錯誤', async () => {
    const spy = vi.spyOn(axios.create(), 'request');
    spy.mockResolvedValueOnce({ status: 500, statusText: 'Internal Server Error' });
    await expect(httpClient.get('/error')).rejects.toThrow('Internal Server Error');
  });

  it('應能處理其餘 HTTP 方法 (如 PATCH)', async () => {
    const spy = vi.spyOn(axios.create(), 'request');
    await httpClient.patch('/update', { score: 100 });
    const calledOption = spy.mock.calls[0][0];
    expect(calledOption.method).toBe('PATCH');
    expect(calledOption.data).toEqual({ score: 100 });
  });

  it('應能處理 HEAD 請求', async () => {
    const spy = vi.spyOn(axios.create(), 'request');
    await httpClient.call('/headers', 'HEAD', { auth: true });
    const calledOption = spy.mock.calls[0][0];
    expect(calledOption.method).toBe('HEAD');
    expect(calledOption.params).toEqual({ auth: true });
  });
  
  it('應能正確處理 OPTIONS 請求的參數映射', async () => {
    const spy = vi.spyOn(axios.create(), 'request');
    await httpClient.call('/test', 'OPTIONS', { debug: true });
    const calledOption = spy.mock.calls[0][0];
    expect(calledOption.method).toBe('OPTIONS');
    expect(calledOption.params).toEqual({ debug: true });
    expect(calledOption.data).toBeUndefined();
  });

  it('當使用非標準方法時，應正確處理 params 與 data (進入 default 分支的剩餘路徑)', async () => {
    const spy = vi.spyOn(axios.create(), 'request');
    await httpClient.call('/test', 'LINK' as any, { val: 1 });
    const calledOption = spy.mock.calls[0][0];
    expect(calledOption.method).toBe('LINK');
    expect(calledOption.params).toBeUndefined();
    expect(calledOption.data).toEqual({ val: 1 });
  });

  it('測試 timeout 的預設分支', async () => {
    const spy = vi.spyOn(axios.create(), 'request');
    await httpClient.get('/test');
    const calledOption = spy.mock.calls[0][0];
    expect(calledOption.timeout).toBe(60000);
  });
});
