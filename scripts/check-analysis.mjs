import assert from 'node:assert/strict';
import fs from 'node:fs';
import { uniqueById, groupByCause, sameCause, readAs } from '../src/lib/kb/causes.ts';
import { deskRef } from '../src/lib/kb/desk-ref.ts';

const data = new URL('../src/lib/data/', import.meta.url);
const reports = JSON.parse(fs.readFileSync(new URL('reports-4471.json', data)));
const tenants = new Map(fs.readdirSync(new URL('tenants/', data)).map((name) => {
  const t = JSON.parse(fs.readFileSync(new URL('tenants/' + name, data)));
  return [t.handle, t];
}));
const notes = JSON.parse(fs.readFileSync(new URL('desk-notes.json', data)));
const merged = uniqueById(reports).filter((r) => r.mergedInto === 4471);
const groups = groupByCause(merged, (r) => tenants.get(r.tenant));
assert.equal(reports.length, 427);
assert.equal(merged.length, 412);
assert.deepEqual(Object.fromEntries(groups.map((g) => [g.cause, g.reports.length])), { parser: 379, hint: 33 });
assert.equal(new Set(groups.flatMap((g) => g.reports.map((r) => r.id))).size, merged.length);
assert.equal(groups.reduce((n, g) => n + readAs(g, notes.oneDayMove), 0), 5);
assert.equal(groups.reduce((n, g) => n + g.reports.filter((r) => r.meta.intakeTag !== g.cause).length, 0), 38);
assert.equal(sameCause({ channel: 'form' }, tenants.get('alder.physio'), { channel: 'app' }, tenants.get('alder.physio')), false);
assert.equal(sameCause({ channel: 'app' }, tenants.get('kettle.books'), { channel: 'email' }, tenants.get('kettle.books')), true);
assert.equal(sameCause({ channel: 'email' }, undefined, { channel: 'email' }, undefined), false);
for (const id of new Set(reports.map((r) => r.id))) {
  assert.equal(new Set(reports.filter((r) => r.id === id).map((r) => JSON.stringify(r))).size, 1, `conflicting overlap: ${id}`);
}
const page = fs.readFileSync(new URL('../src/routes/kb/decisions/0002-triage-by-cause/+page.svx', import.meta.url), 'utf8');
const signature = page.match(/^signature: '(.+)'$/m)[1];
const built = fs.readFileSync(new URL('../build/kb/decisions/0002-triage-by-cause/index.html', import.meta.url), 'utf8');
assert.ok(built.includes(deskRef(signature)), 'desk ref must come from the supplied component');
for (const value of ['379', '33', '412', '427', '38', 'different causes', 'same cause', 'received', 'merged']) assert.ok(built.includes(value), `render missing ${value}`);
assert.ok(!built.includes('no desk ref:'), 'signed page must render its stamp');
console.log('Verified 412 unique reports, 379/33 split, overlap integrity, triage cases, and rendered signed page.');
