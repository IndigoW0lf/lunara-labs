import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const key = (slug) => 'lunara-labs:1:' + slug;
const notice = (page) => page.getByRole('complementary', { name: 'Saving your work' });
async function raw(page, slug) {
  return page.evaluate((key) => localStorage.getItem(key), key(slug));
}
async function backup(page, name) {
  const pending = page.waitForEvent('download');
  await notice(page).getByRole('button', { name, exact: true }).click();
  const file = await pending;
  return readFile(await file.path(), 'utf8');
}
async function seed(page, slug, value) {
  await page.goto('/#/about');
  await page.evaluate(({ key, value }) => localStorage.setItem(key, value), {
    key: key(slug),
    value,
  });
}

for (const slug of ['rumor', 'attention', 'evidence']) {
  test(`${slug}: protect a future save, back it up exactly, and retain new work separately`, async ({
    page,
  }) => {
    const original = ' { "version": "99.0.0", "state": { "note": "Synthetic future work" } } ';
    await seed(page, slug, original);
    await page.goto('/#/' + slug);
    await expect(notice(page)).toContainText('a version this app cannot open');
    expect(await backup(page, 'Download original saved copy')).toBe(original);
    if (slug === 'evidence') {
      await page.locator('#initial-thought').fill('Synthetic session-only question');
    } else {
      await page.locator('#start').click();
      if (slug === 'rumor') await page.locator('#trace-note').fill('Synthetic session-only note');
      else await page.locator('#untimed').check();
    }
    const copy = JSON.parse(await backup(page, 'Download this tab’s work'));
    if (slug === 'evidence')
      expect(copy.state.initialThought).toBe('Synthetic session-only question');
    else if (slug === 'rumor') expect(copy.state.traceNote).toBe('Synthetic session-only note');
    else expect(copy.state.untimed).toBe(true);
    expect(await raw(page, slug)).toBe(original);
    await page.reload();
    await expect(notice(page)).toBeVisible();
    expect(await raw(page, slug)).toBe(original);
  });
}

const cases = [
  {
    slug: 'rumor',
    version: '0.2.0',
    state: { step: 3, message: 'Synthetic shared note' },
    selector: '#useful-message',
    field: 'message',
  },
  {
    slug: 'evidence',
    version: '1.0.0',
    state: {
      step: 0,
      placements: { A: 'unplaced', B: 'unplaced', C: 'unplaced', D: 'unplaced' },
      initialThought: 'Synthetic shared note',
    },
    selector: '#initial-thought',
    field: 'initialThought',
  },
];
for (const { slug, version, state, selector, field } of cases) {
  test(`${slug}: a second tab cannot overwrite another tab's notes and can download its own work`, async ({
    page,
    context,
  }) => {
    await seed(page, slug, JSON.stringify({ version, state }));
    await page.goto('/#/' + slug);
    const other = await context.newPage();
    await other.goto('/#/' + slug);
    await page.locator(selector).fill('Synthetic first-tab update');
    await expect(notice(other)).toContainText('changed outside this tab');
    await other.locator(selector).fill('Synthetic second-tab work');
    expect(JSON.parse(await raw(page, slug)).state[field]).toBe('Synthetic first-tab update');
    const copy = JSON.parse(await backup(other, 'Download this tab’s work'));
    expect(copy.state[field]).toBe('Synthetic second-tab work');
    await other.reload();
    await expect(other.locator(selector)).toHaveValue('Synthetic first-tab update');
    await expect(notice(other)).toHaveCount(0);
    await other.close();
  });
}

test('Attention: clock and route cleanup cannot replace a save changed by another tab', async ({
  page,
  context,
}) => {
  await page.clock.install();
  const other = await context.newPage();
  await other.goto('/#/about');
  await page.goto('/#/attention');
  await page.bringToFront();
  await page.locator('#start').click();
  await page.locator('input[name="prediction"][value="same"]').check();
  await page.locator('input[name="order"][value="quiet"]').check();
  await page.locator('#prepare').click();
  await page.locator('#begin-round').click();
  await page.clock.runFor(3000);
  const replacement = JSON.stringify({
    version: '0.3.0',
    state: { step: 1, prediction: 'Synthetic other-tab save' },
  });
  await other.evaluate(({ key, replacement }) => localStorage.setItem(key, replacement), {
    key: key('attention'),
    replacement,
  });
  await expect(notice(page)).toContainText('changed outside this tab');
  await page.clock.runFor(5000);
  await page.locator('#pause-round').click();
  const copy = JSON.parse(await backup(page, 'Download this tab’s work'));
  expect(copy.state.active.status).toBe('paused');
  expect(copy.state.active.elapsed).toBeGreaterThanOrEqual(8);
  await page.getByRole('link', { name: 'Explore the labs', exact: true }).click();
  expect(await raw(other, 'attention')).toBe(replacement);
  await other.close();
});

test('a same-tab change is caught before saving; unrelated labs and session storage are ignored', async ({
  page,
}) => {
  await page.goto('/#/evidence');
  await page.locator('#initial-thought').fill('Synthetic initial work');
  await page.evaluate(() => {
    localStorage.setItem('lunara-labs:1:rumor', 'Synthetic unrelated change');
    window.dispatchEvent(
      new StorageEvent('storage', { key: 'lunara-labs:1:evidence', storageArea: sessionStorage }),
    );
  });
  await expect(notice(page)).toHaveCount(0);
  await page.locator('#initial-thought').fill('Synthetic continued work');
  const replacement = JSON.stringify({
    version: '99.0.0',
    state: { note: 'Synthetic external save' },
  });
  await page.evaluate(({ key, replacement }) => localStorage.setItem(key, replacement), {
    key: key('evidence'),
    replacement,
  });
  await page.locator('#initial-thought').fill('Synthetic stale work');
  await expect(notice(page)).toContainText('changed outside this tab');
  expect(await raw(page, 'evidence')).toBe(replacement);
});

test('unreadable saves remain available as exact backups while typed work stays usable', async ({
  page,
}) => {
  const original = '{Synthetic broken JSON';
  await seed(page, 'evidence', original);
  await page.goto('/#/evidence');
  await expect(notice(page)).toContainText('could not read the saved work');
  await page.locator('#initial-thought').fill('Synthetic recovered session');
  expect(await backup(page, 'Download original saved copy')).toBe(original);
  expect(JSON.parse(await backup(page, 'Download this tab’s work')).state.initialThought).toBe(
    'Synthetic recovered session',
  );
  expect(await raw(page, 'evidence')).toBe(original);
});
