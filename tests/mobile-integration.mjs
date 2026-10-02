import assert from 'node:assert/strict';
const base = process.env.TEST_API_BASE_URL;
if (!base) throw Error('Set TEST_API_BASE_URL to an isolated, seeded test backend. This test creates records.');
async function call(path, token, method = 'GET', body) {
 const response = await fetch(`${base}${path}`, { method, headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(body ? { 'Content-Type': 'application/json' } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}), redirect: 'manual' });
 const data = await response.json(); return { status: response.status, data };
}
async function login(email) {
 const response = await call('/api/auth/mobile', null, 'POST', { email, password: 'LoopPass123!' });
 assert.equal(response.status, 200); assert.match(response.data.token, /^[a-f0-9]{64}$/);
 return response.data.token;
}
for (const path of ['/api/dashboard', '/api/users/me', '/api/profile/me', '/api/marketplace/listings', '/api/rides', '/api/study-groups', '/api/messages/previews', '/api/search?q=book', '/api/messages/missing']) {
 assert.equal((await call(path)).status, 401, path);
 assert.equal((await call(path, 'invalid-token')).status, 401, path);
}
assert.equal((await call('/api/auth/mobile', null, 'POST', { email: 'avery@uwaterloo.ca', password: 'wrong-password' })).status, 401);
assert.equal((await call('/api/auth/mobile', null, 'POST', { email: 'unknown@uwaterloo.ca', password: 'LoopPass123!' })).status, 401);
const avery = await login('avery@uwaterloo.ca');
const beta = await login('beta1@uwaterloo.ca');
const stranger = await login('beta2@uwaterloo.ca');
const user = (await call('/api/users/me', avery)).data;
assert.equal(user.email, 'avery@uwaterloo.ca');
assert.equal(user.passwordHash, undefined);
assert.equal((await call('/api/profile/me', avery)).status, 200);
assert.equal((await call('/api/dashboard', avery)).data.user.id, user.id);
// Session restore: a new request with the saved token authenticates without credentials.
assert.equal((await call('/api/users/me', avery)).data.id, user.id);
assert.equal((await call('/api/marketplace/listings', avery, 'POST', { title: 'x' })).status, 400);
const suffix = Date.now();
const listing = await call('/api/marketplace/listings', avery, 'POST', { title: `Mobile test book ${suffix}`, description: 'An integration test book.', price: 12, location: 'SLC', category: 'Books', sellerId: 'forged' });
assert.equal(listing.status, 201);
const persisted = (await call('/api/marketplace/listings', beta)).data.find(l => l.id === listing.data.id);
assert.equal(persisted.seller.id, user.id);
assert.equal((await call(`/api/marketplace/listings/${persisted.id}/contact`, avery, 'POST')).status, 400);
const contact = await call(`/api/marketplace/listings/${persisted.id}/contact`, beta, 'POST');
assert.equal(contact.status, 201);
const conversationId = contact.data.conversationId;
assert.equal((await call(`/api/marketplace/listings/${persisted.id}/contact`, beta, 'POST')).data.conversationId, conversationId);
assert.equal((await call(`/api/messages/${conversationId}`, stranger)).status, 404);
assert.equal((await call(`/api/messages/${conversationId}`, stranger, 'POST', { body: 'intrusion' })).status, 404);
assert.equal((await call(`/api/messages/${conversationId}`, beta, 'POST', { body: '   ' })).status, 400);
assert.equal((await call(`/api/messages/${conversationId}`, beta, 'POST', { body: `Persistent message ${suffix}`, senderId: user.id })).status, 201);
const thread = (await call(`/api/messages/${conversationId}`, avery)).data;
assert.equal(thread.at(-1).body, `Persistent message ${suffix}`);
assert.equal(thread.at(-1).sender, 'other');
assert.equal((await call(`/api/messages/${conversationId}`, beta)).data.at(-1).sender, 'self');
assert.ok((await call('/api/messages/previews', beta)).data.some(c => c.id === conversationId));
const ride = await call('/api/rides', avery, 'POST', { route: `Waterloo to Toronto ${suffix}`, departure: 'Friday at 5:00 PM', pricePerSeat: 10, seats: 1, car: 'Honda Civic', mode: 'OFFER' });
assert.equal(ride.status, 201);
assert.equal((await call(`/api/rides/${ride.data.id}/request-seat`, avery, 'POST')).status, 400);
assert.equal((await call(`/api/rides/${ride.data.id}/request-seat`, beta, 'POST')).status, 201);
assert.equal((await call(`/api/rides/${ride.data.id}/request-seat`, beta, 'POST')).status, 200);
assert.equal((await call(`/api/rides/${ride.data.id}/request-seat`, stranger, 'POST')).status, 409);
assert.equal((await call('/api/rides', beta)).data.find(r => r.id === ride.data.id).requestedByCurrentUser, true);
assert.equal((await call('/api/rides', avery, 'POST', { route: 'Waterloo to Toronto', departure: 'Monday morning', pricePerSeat: 10, seats: 1, car: 'Any verified driver', mode: 'REQUEST' })).status, 201);
const group = await call('/api/study-groups', avery, 'POST', { course: 'CS 246', title: `Mobile test study ${suffix}`, schedule: 'Sunday at 3:00 PM', location: 'DC Library', seatsLeft: 1, focus: 'Review midterm practice problems' });
assert.equal(group.status, 201);
assert.equal((await call(`/api/study-groups/${group.data.id}/join`, avery, 'POST')).status, 400);
assert.equal((await call(`/api/study-groups/${group.data.id}/join`, beta, 'POST')).status, 201);
assert.equal((await call(`/api/study-groups/${group.data.id}/join`, beta, 'POST')).status, 200);
assert.equal((await call(`/api/study-groups/${group.data.id}/join`, stranger, 'POST')).status, 409);
assert.equal((await call('/api/study-groups', beta)).data.find(g => g.id === group.data.id).joinedByCurrentUser, true);
assert.ok((await call(`/api/search?q=${suffix}`, beta)).data.listings.some(l => l.id === listing.data.id));
const profile = { name: user.name, program: user.program, year: user.year, avatar: user.avatar };
assert.equal((await call('/api/profile/me', avery, 'PATCH', { ...profile, name: 'Integration Student' })).status, 200);
assert.equal((await call('/api/users/me', avery)).data.name, 'Integration Student');
await call('/api/profile/me', avery, 'PATCH', profile);
assert.equal((await call('/api/auth/mobile', avery, 'DELETE')).status, 200);
assert.equal((await call('/api/users/me', avery)).status, 401);
for (const token of [beta, stranger]) await call('/api/auth/mobile', token, 'DELETE');
console.log('PASS: auth, restore, logout, protected routes, listing, seller contact, threads, rides, study groups, profile, search, validation, authorization.');
// Existing NextAuth browser credentials flow still works without bearer tokens.
const csrfResponse = await fetch(`${base}/api/auth/csrf`);
const csrf = await csrfResponse.json();
const cookie = csrfResponse.headers.getSetCookie().map(c => c.split(';')[0]).join('; ');
const webLogin = await fetch(`${base}/api/auth/callback/credentials`, {
 method: 'POST', redirect: 'manual', headers: { Cookie: cookie, 'Content-Type': 'application/x-www-form-urlencoded' },
 body: new URLSearchParams({ csrfToken: csrf.csrfToken, email: 'avery@uwaterloo.ca', password: 'LoopPass123!', callbackUrl: base, json: 'true' })
});
const webCookies = [cookie, ...webLogin.headers.getSetCookie().map(c => c.split(';')[0])].join('; ');
const webSession = await fetch(`${base}/api/auth/session`, { headers: { Cookie: webCookies } });
assert.equal((await webSession.json()).user.email, 'avery@uwaterloo.ca');
const webListings = await fetch(`${base}/api/marketplace/listings`, { headers: { Cookie: webCookies } });
assert.equal(webListings.status, 200);
assert.equal((await fetch(`${base}/profile`, { redirect: 'manual' })).status, 307);
console.log('PASS: existing web NextAuth credentials, cookie-authenticated API access, and page protection.');

if (process.env.TEST_DATABASE_URL) {
  const { PrismaClient } = await import('@prisma/client');
  const { createHash } = await import('node:crypto');
  const db = new PrismaClient({ datasources: { db: { url: process.env.TEST_DATABASE_URL } } });
  try {
    const token = await login('avery@uwaterloo.ca');
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const session = await db.mobileSession.findUniqueOrThrow({ where: { tokenHash } });
    assert.notEqual(session.tokenHash, token);
    await db.mobileSession.update({ where: { id: session.id }, data: { expiresAt: new Date(Date.now() - 1000) } });
    assert.equal((await call('/api/users/me', token)).status, 401);
    await db.mobileSession.delete({ where: { id: session.id } });
    console.log('PASS: hashed token storage and server-side expiry rejection.');
  } finally { await db.$disconnect(); }
}
