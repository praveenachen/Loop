const { test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
global.__DEV__ = true;
const { request, configureSession, mobileApi, ApiError } = require('../lib/api.ts');
beforeEach(() => { process.env.EXPO_PUBLIC_API_BASE_URL = 'https://loop.example/'; configureSession(null); });
test('uses configured base URL, JSON body and bearer token', async () => {
 configureSession('session-token');
 global.fetch = async (url, options) => {
  assert.equal(url, 'https://loop.example/api/test');
  assert.equal(options.headers.Authorization, 'Bearer session-token');
  assert.equal(options.body, JSON.stringify({ body: 'hello' }));
  return { ok: true, json: async () => ({ id: 'saved' }) };
 };
 assert.deepEqual(await request('/api/test', 'POST', { body: 'hello' }), { id: 'saved' });
});
test('401 invalidates only the matching active session', async () => {
 let expired = 0;
 configureSession('old-token', () => expired++);
 let resolve;
 global.fetch = () => new Promise(r => resolve = r);
 const pending = request('/api/test');
 configureSession('new-token', () => expired++);
 resolve({ ok: false, status: 401, json: async () => ({ error: 'Unauthorized' }) });
 await assert.rejects(pending, e => e instanceof ApiError && e.status === 401);
 assert.equal(expired, 0);
 global.fetch = async () => ({ ok: false, status: 401, json: async () => ({ error: 'Unauthorized' }) });
 await assert.rejects(request('/api/test'));
 assert.equal(expired, 1);
});
test('hides server dumps and provides offline feedback', async () => {
 global.fetch = async () => ({ ok: false, status: 500, json: async () => ({ error: 'database password / internal details' }) });
 await assert.rejects(request('/api/test'), /temporarily unavailable/);
 global.fetch = async () => { throw Error('socket details'); };
 await assert.rejects(request('/api/test'), /Check your connection/);
});
test('fails when configuration is missing or production URL is insecure', async () => {
 delete process.env.EXPO_PUBLIC_API_BASE_URL;
 await assert.rejects(request('/api/test'), /Configure EXPO_PUBLIC/);
 global.__DEV__ = false; process.env.EXPO_PUBLIC_API_BASE_URL = 'http://loop.example';
 await assert.rejects(request('/api/test'), /HTTPS/);
 global.__DEV__ = true;
});
test('loads only backend data and derives personal activity', async () => {
 const user = { id: 'me', name: 'Real Student' };
 global.fetch = async url => ({ ok: true, json: async () => {
  if (url.endsWith('/profile/me')) return { user, reviews: [] };
  if (url.endsWith('/dashboard')) return { user };
  if (url.endsWith('/marketplace/listings')) return [{ id: 'mine', isOwner: true, title: 'Persisted item', category: 'Books', location: 'SLC' }, { id: 'other', isOwner: false }];
  return [];
 } });
 const data = await mobileApi.load();
 assert.equal(data.user.name, 'Real Student');
 assert.equal(data.activity.length, 1);
 assert.equal(data.activity[0].entityId, 'mine');
 assert.deepEqual(data.chats, []);
});
