import { test } from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryWerfRepository } from '../src/infrastructure/InMemoryWerfRepository.ts';
import { seedProjects, seedWerfItems } from '../src/infrastructure/seedData.ts';
import { changeItemStatus } from '../src/application/commands.ts';
import { getVisibleProjects, getBackofficeReport } from '../src/application/queries.ts';

const now = new Date('2026-02-05');
const createRepository = () => new InMemoryWerfRepository(seedProjects, seedWerfItems);

test('search and active project queries retain projects with no items when requested', () => {
  const snapshot = createRepository().getSnapshot();
  assert.equal(getVisibleProjects(snapshot, '', false, now).length, 5);
  assert.equal(getVisibleProjects(snapshot, '', true, now).length, 1);
  assert.equal(getVisibleProjects(snapshot, 'KERKSTRAAT', true, now)[0].open, 4);
  assert.equal(getVisibleProjects(snapshot, 'does not exist', false, now).length, 0);
});

test('status command updates summaries and reports using a new snapshot, without mutating seeds', () => {
  const repository = createRepository();
  const before = repository.getSnapshot();
  let notifications = 0;
  const unsubscribe = repository.subscribe(() => notifications++);
  changeItemStatus(repository, '1', 'voltooid');
  const after = repository.getSnapshot();
  assert.notEqual(before, after);
  assert.equal(repository.getSnapshot(), after);
  assert.equal(before.items[0].status, 'uit te voeren');
  assert.equal(seedWerfItems[0].status, 'uit te voeren');
  assert.equal(notifications, 1);
  const report = getBackofficeReport(after, now);
  assert.deepEqual(report.summary, { total: 5, open: 3, overdue: 1, completed: 2 });
  assert.equal(report.projects[0].open, 3);
  assert.equal(report.byStatus.voltooid.length, 2);
  assert.equal(report.statusData.reduce((sum, row) => sum + row.value, 0), 5);
  assert.equal(report.categoryData.reduce((sum, row) => sum + row.items, 0), 5);
  assert.equal(report.priorityData.reduce((sum, row) => sum + row.value, 0), 5);
  unsubscribe();
  changeItemStatus(repository, '2', 'voltooid');
  assert.equal(notifications, 1);
});

test('separate repository instances have independent session data', () => {
  const first = createRepository();
  const second = createRepository();
  changeItemStatus(first, '1', 'voltooid');
  assert.equal(second.getSnapshot().items[0].status, 'uit te voeren');
});

test('invalid commands leave the snapshot and subscribers unchanged', () => {
  const repository = createRepository();
  const before = repository.getSnapshot();
  let notified = false;
  repository.subscribe(() => { notified = true; });
  assert.throws(() => changeItemStatus(repository, 'missing', 'voltooid'), /not found/);
  assert.throws(() => changeItemStatus(repository, '1', 'invalid'), /Invalid item status/);
  assert.equal(repository.getSnapshot(), before);
  assert.equal(notified, false);
});

test('application command works against an injected repository contract', () => {
  const writes = [];
  const repository = { updateItemStatus: (...args) => writes.push(args) };
  changeItemStatus(repository, '42', 'in uitvoering');
  assert.deepEqual(writes, [['42', 'in uitvoering']]);
});
