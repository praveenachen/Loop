const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
const React = require('react');
const { create, act } = require('react-test-renderer');
global.IS_REACT_ACT_ENVIRONMENT = true;
global.__DEV__ = true;
let saved = null;
let storageFails = false;
let foreground;
const secureStore = {
 getItemAsync: async () => saved,
 setItemAsync: async (_key, token) => { if (storageFails) throw Error('native details'); saved = token; },
 deleteItemAsync: async () => { saved = null; }
};
const load = Module._load;
Module._load = function(name, ...args) {
 if (name === 'expo-secure-store') return secureStore;
 if (name === 'react-native') return { AppState: { addEventListener: (_event, callback) => { foreground = callback; return { remove() { foreground = null; } }; } } };
 return load.call(this, name, ...args);
};
const { AppProvider, useLoop } = require('../lib/AppProvider.tsx');
Module._load = load;
const { configureSession } = require('../lib/api.ts');
let current, tree, requests;
function Probe() { current = useLoop(); return null; }
const user = { id: 'real-user', name: 'Real Student' };
function mockBackend(expired = false) {
 global.fetch = async (url, options) => {
  requests.push({ url, options });
  if (url.endsWith('/api/auth/mobile')) return { ok: true, json: async () => options.method === 'DELETE' ? { ok: true } : { token: 'issued-session-token' } };
  if (expired) return { ok: false, status: 401, json: async () => ({ error: 'Unauthorized' }) };
  return { ok: true, json: async () => url.endsWith('/api/profile/me') ? { user, reviews: [] } : url.endsWith('/api/dashboard') ? { user } : [] };
 };
}
async function mount() {
 await act(async () => { tree = create(React.createElement(AppProvider, null, React.createElement(Probe))); });
}
beforeEach(() => { saved = null; storageFails = false; requests = []; configureSession(null); process.env.EXPO_PUBLIC_API_BASE_URL = 'https://loop.example'; mockBackend(); });
afterEach(async () => { if (tree) await act(async () => tree.unmount()); tree = null; });
test('launch without a token ends restoration outside the authenticated shell', async () => {
 await mount();
 assert.equal(current.restoring, false); assert.equal(current.signedIn, false);
 assert.equal(requests.length, 0); assert.deepEqual(current.data.listings, []);
});
test('sign-in stores only the token, attaches it, and logout clears private state', async () => {
 await mount();
 await act(async () => current.signIn('STUDENT@UWATERLOO.CA', 'password-not-stored'));
 assert.equal(saved, 'issued-session-token'); assert.equal(current.signedIn, true);
 assert.equal(current.data.user.id, user.id);
 const credentials = JSON.parse(requests[0].options.body);
 assert.equal(credentials.email, 'student@uwaterloo.ca');
 assert.ok(requests.slice(1).every(r => r.options.headers.Authorization === 'Bearer issued-session-token'));
 await act(async () => current.logout());
 assert.equal(saved, null); assert.equal(current.signedIn, false);
 assert.equal(current.data.user.id, ''); assert.deepEqual(current.data.chats, []);
 assert.equal(requests.at(-1).options.method, 'DELETE');
});
test('saved token restores data without requesting credentials and refreshes on foreground', async () => {
 saved = 'restored-session-token'; await mount();
 assert.equal(current.restoring, false); assert.equal(current.signedIn, true);
 assert.equal(current.data.user.name, 'Real Student');
 assert.ok(requests.every(r => r.options.headers.Authorization === 'Bearer restored-session-token'));
 const count = requests.length;
 await act(async () => foreground('active'));
 assert.ok(requests.length > count);
});
test('invalid saved token removes storage and returns to unauthenticated state', async () => {
 saved = 'expired-session-token'; mockBackend(true); await mount();
 assert.equal(current.signedIn, false); assert.equal(current.restoring, false);
 assert.equal(saved, null); assert.equal(current.data.user.id, '');
});
test('SecureStore failure prevents sign-in and revokes the unused session', async () => {
 storageFails = true; await mount();
 await act(async () => { await assert.rejects(current.signIn('student@uwaterloo.ca', 'password'), /Secure sign-in storage is unavailable/); });
 assert.equal(current.signedIn, false); assert.equal(saved, null);
 assert.equal(requests.at(-1).options.method, 'DELETE');
});
test('offline logout still clears local storage and private state', async () => {
 saved = 'restored-session-token'; await mount();
 global.fetch = async () => { throw Error('offline'); };
 await act(async () => { await assert.rejects(current.logout(), /Could not connect/); });
 assert.equal(current.signedIn, false); assert.equal(saved, null);
 assert.equal(current.data.user.id, '');
});
