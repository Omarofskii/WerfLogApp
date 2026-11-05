import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const src = fileURLToPath(new URL('../src/', import.meta.url));
async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => entry.isDirectory()
    ? files(path.join(directory, entry.name)) : [path.join(directory, entry.name)]));
  return nested.flat().filter(file => /\.tsx?$/.test(file));
}

test('layer imports follow the architecture dependency rules', async () => {
  const allowed = {
    domain: new Set(['domain']),
    application: new Set(['application', 'domain']),
    infrastructure: new Set(['infrastructure', 'application', 'domain']),
    app: new Set(['app', 'application', 'domain']),
  };
  for (const file of await files(src)) {
    const layer = path.relative(src, file).split(path.sep)[0];
    if (!allowed[layer]) continue; // main.tsx is the composition root.
    const source = await readFile(file, 'utf8');
    for (const match of source.matchAll(/(?:from\s*|import\s*)["']([^"']+)["']/g)) {
      const specifier = match[1];
      if (!specifier.startsWith('.')) {
        assert.notEqual(layer, 'domain', `${file}: domain must have no framework dependencies`);
        assert.notEqual(layer, 'application', `${file}: application must have no framework dependencies`);
        continue;
      }
      const dependency = path.relative(src, path.resolve(path.dirname(file), specifier)).split(path.sep)[0];
      assert.ok(allowed[layer].has(dependency), `${file}: ${layer} cannot depend on ${dependency}`);
    }
  }
});
