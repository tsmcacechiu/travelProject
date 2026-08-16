import { test, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { scaffoldTrip, folderName, ScaffoldError } from './scaffold.mjs';

let baseDir;

beforeEach(() => {
  baseDir = fs.mkdtempSync(path.join(os.tmpdir(), 'travel-detail-scaffold-'));
  fs.mkdirSync(path.join(baseDir, '_shared'), { recursive: true });
  fs.writeFileSync(
    path.join(baseDir, '_shared', 'theme.template.css'),
    ':root{ --primary: #000; }\n',
  );
});

afterEach(() => {
  fs.rmSync(baseDir, { recursive: true, force: true });
});

test('folderName joins destination and yyyymm with the <Destination>-<YYYYMM> convention', () => {
  assert.equal(folderName('Tailand', '202610'), 'Tailand-202610');
});

test('folderName rejects a non-romanized destination', () => {
  assert.throws(() => folderName('清邁', '202610'), ScaffoldError);
});

test('folderName rejects a malformed yyyymm', () => {
  assert.throws(() => folderName('Tailand', '2026-10'), ScaffoldError);
});

test('folderName rejects a trailing hyphen, which would produce a double-hyphen folder name', () => {
  assert.throws(() => folderName('Bangkok-', '202610'), ScaffoldError);
});

test('folderName accepts a multi-word hyphenated destination', () => {
  assert.equal(folderName('Chiang-Mai', '202610'), 'Chiang-Mai-202610');
});

test('creates a correctly named trip folder with the expected files', () => {
  const result = scaffoldTrip({ destination: 'Kyoto', yyyymm: '202611', baseDir });

  const tripDir = path.join(baseDir, 'Kyoto-202611');
  assert.equal(result.tripDir, tripDir);
  assert.ok(fs.statSync(tripDir).isDirectory());
  assert.ok(fs.existsSync(path.join(tripDir, 'dm.html')));
  assert.ok(fs.existsSync(path.join(tripDir, 'theme.css')));
  assert.ok(fs.existsSync(path.join(tripDir, 'plan.md')));
  assert.ok(fs.existsSync(path.join(tripDir, 'link.md')));
});

test('dm.html references the shared component library and scroll-reveal script via relative paths', () => {
  const result = scaffoldTrip({ destination: 'Kyoto', yyyymm: '202611', baseDir });
  const html = fs.readFileSync(result.files.dm, 'utf8');

  assert.match(html, /href="\.\.\/_shared\/components\.css"/);
  assert.match(html, /src="\.\.\/_shared\/scroll-reveal\.js"/);
  assert.match(html, /href="theme\.css"/);
});

test('theme.css starts as a copy of the shared theme template', () => {
  const result = scaffoldTrip({ destination: 'Kyoto', yyyymm: '202611', baseDir });
  const theme = fs.readFileSync(result.files.theme, 'utf8');
  const template = fs.readFileSync(path.join(baseDir, '_shared', 'theme.template.css'), 'utf8');
  assert.equal(theme, template);
});

test('refuses to silently overwrite an existing trip folder', () => {
  fs.mkdirSync(path.join(baseDir, 'Kyoto-202611'));
  fs.writeFileSync(path.join(baseDir, 'Kyoto-202611', 'dm.html'), 'existing content');

  assert.throws(
    () => scaffoldTrip({ destination: 'Kyoto', yyyymm: '202611', baseDir }),
    ScaffoldError,
  );

  const preserved = fs.readFileSync(path.join(baseDir, 'Kyoto-202611', 'dm.html'), 'utf8');
  assert.equal(preserved, 'existing content');
});

test('force never overwrites files that already exist, even the generated ones (dm.html, theme.css)', () => {
  fs.mkdirSync(path.join(baseDir, 'Kyoto-202611'));
  fs.writeFileSync(path.join(baseDir, 'Kyoto-202611', 'dm.html'), 'already-authored itinerary');
  fs.writeFileSync(path.join(baseDir, 'Kyoto-202611', 'theme.css'), 'already-picked theme');

  scaffoldTrip({ destination: 'Kyoto', yyyymm: '202611', baseDir, force: true });

  assert.equal(
    fs.readFileSync(path.join(baseDir, 'Kyoto-202611', 'dm.html'), 'utf8'),
    'already-authored itinerary',
  );
  assert.equal(
    fs.readFileSync(path.join(baseDir, 'Kyoto-202611', 'theme.css'), 'utf8'),
    'already-picked theme',
  );
});

test('force fills in only the files that are missing from an otherwise-existing folder', () => {
  fs.mkdirSync(path.join(baseDir, 'Kyoto-202611'));
  fs.writeFileSync(path.join(baseDir, 'Kyoto-202611', 'plan.md'), '我自己寫的筆記');
  // dm.html, theme.css, link.md are all missing.

  const result = scaffoldTrip({ destination: 'Kyoto', yyyymm: '202611', baseDir, force: true });

  assert.ok(fs.existsSync(result.files.dm));
  assert.ok(fs.existsSync(result.files.theme));
  assert.ok(fs.existsSync(result.files.link));
  assert.equal(fs.readFileSync(result.files.plan, 'utf8'), '我自己寫的筆記');
});

test('does not clobber an existing plan.md even when force is true, since it is user-owned content', () => {
  fs.mkdirSync(path.join(baseDir, 'Kyoto-202611'));
  fs.writeFileSync(path.join(baseDir, 'Kyoto-202611', 'plan.md'), '我自己寫的筆記');

  scaffoldTrip({ destination: 'Kyoto', yyyymm: '202611', baseDir, force: true });

  const plan = fs.readFileSync(path.join(baseDir, 'Kyoto-202611', 'plan.md'), 'utf8');
  assert.equal(plan, '我自己寫的筆記');
});

test('does not clobber an existing link.md even when force is true, since it is user-owned content', () => {
  fs.mkdirSync(path.join(baseDir, 'Kyoto-202611'));
  fs.writeFileSync(path.join(baseDir, 'Kyoto-202611', 'link.md'), '# 我自己整理的連結\nhttps://example.com\n');

  scaffoldTrip({ destination: 'Kyoto', yyyymm: '202611', baseDir, force: true });

  const link = fs.readFileSync(path.join(baseDir, 'Kyoto-202611', 'link.md'), 'utf8');
  assert.equal(link, '# 我自己整理的連結\nhttps://example.com\n');
});

test('fails clearly and makes no changes when theme.template.css is missing', () => {
  fs.rmSync(path.join(baseDir, '_shared', 'theme.template.css'));

  assert.throws(
    () => scaffoldTrip({ destination: 'Kyoto', yyyymm: '202611', baseDir }),
    ScaffoldError,
  );
  assert.equal(fs.existsSync(path.join(baseDir, 'Kyoto-202611')), false);
});
