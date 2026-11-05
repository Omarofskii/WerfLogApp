import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterItems, isItemOverdue, sortItemsByUrgency, summarizeItems } from '../src/domain/itemRules.ts';
import { validateItemCategory, validateItemDetails } from '../src/domain/itemValidation.ts';

const now = new Date('2026-02-01T00:00:00Z');
const item = (overrides = {}) => ({
  itemId: '1', projectId: 'p1', datum: now, deadline: new Date('2026-01-31'),
  latitude: 51, longitude: 3, hoofdcategorie: 'Riolering', subcategorie: 'Huisaansluiting',
  titel: 'Water Leak', opmerking: 'Inspect Drain', status: 'uit te voeren',
  adresLocatie: '', contactpersoon: '', contactgegevens: '', prioriteit: 3, attachments: [], ...overrides,
});

test('completed items and deadlines equal to now are not overdue', () => {
  assert.equal(isItemOverdue(item(), now), true);
  assert.equal(isItemOverdue(item({ status: 'voltooid' }), now), false);
  assert.equal(isItemOverdue(item({ deadline: now }), now), false);
});

test('filters combine project, case-insensitive title/remark search, category and status', () => {
  const items = [item(), item({ itemId: '2', projectId: 'p2' }), item({ itemId: '3', status: 'voltooid' })];
  assert.deepEqual(filterItems(items, { projectId: 'p1', search: 'DRAIN', category: 'Riolering', status: 'overdue' }, now).map(i => i.itemId), ['1']);
  assert.equal(filterItems(items, { search: 'LEAK', status: 'all', category: 'all' }, now).length, 3);
  assert.equal(filterItems(items, { category: 'Groen' }, now).length, 0);
});

test('urgency order prioritizes overdue work, then deadline, without mutating input', () => {
  const items = [item({ itemId: 'completed', status: 'voltooid', deadline: new Date('2025-01-01') }),
    item({ itemId: 'future', deadline: new Date('2026-03-01') }), item({ itemId: 'late' })];
  assert.deepEqual(sortItemsByUrgency(items, now).map(i => i.itemId), ['late', 'completed', 'future']);
  assert.deepEqual(items.map(i => i.itemId), ['completed', 'future', 'late']);
  assert.deepEqual(summarizeItems(items, now), { total: 3, open: 2, overdue: 1, completed: 1 });
});

test('category validation rejects missing and stale subcategories', () => {
  assert.ok(validateItemCategory('', '').hoofdcategorie);
  assert.ok(validateItemCategory('Riolering', 'Voetpad').subcategorie);
  assert.deepEqual(validateItemCategory('Riolering', 'Huisaansluiting'), {});
  assert.deepEqual(validateItemCategory('Groen', ''), {});
});

test('detail validation requires a title and valid coordinates, including zero', () => {
  assert.ok(validateItemDetails('  ', null).titel);
  assert.ok(validateItemDetails('Leak', { lat: NaN, lng: 3 }).gps);
  assert.ok(validateItemDetails('Leak', { lat: 91, lng: 3 }).gps);
  assert.deepEqual(validateItemDetails('Leak', { lat: 0, lng: 0 }), {});
});
