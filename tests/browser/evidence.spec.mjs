import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
const raw = (page) =>
  page.evaluate(() => JSON.parse(localStorage.getItem('lunara-labs:1:evidence')));
async function open(page) {
  await page.goto('/#/evidence');
  await page.locator('#open-workbench').click();
}
async function place(page, id, target) {
  await page.getByLabel('Place record ' + id, { exact: true }).selectOption(target);
  await expect(
    page.locator(`[data-evidence-target="${target}"] [data-evidence-card="${id}"]`),
  ).toBeVisible();
}
test('evidence: keyboard/menu arrangement, sources, feedback, reload, ledger and restart', async ({
  page,
}) => {
  await page.goto('/');
  await page.locator('.lab-card.blue a.button').click();
  await page.locator('#initial-thought').fill('Synthetic: who recorded each reading?');
  await page.locator('#open-workbench').click();
  const destinationMenu = page.getByLabel('Place record B', { exact: true });
  await destinationMenu.focus();
  await destinationMenu.press('Home');
  await destinationMenu.press('ArrowDown');
  await destinationMenu.press('Enter');
  await expect(
    page.locator('[data-evidence-target="recorded"] [data-evidence-card="B"]'),
  ).toBeVisible();
  await expect(page.getByLabel('Place record B', { exact: true })).toBeFocused();
  await page.locator('#undo-evidence').click();
  expect((await raw(page)).state.placements.B).toBe('unplaced');
  await place(page, 'A', 'recorded');
  await place(page, 'B', 'recorded');
  await place(page, 'C', 'recorded');
  await place(page, 'D', 'aside');
  await page.getByRole('button', { name: 'Follow source B', exact: true }).click();
  await expect(page.locator('.evidence-trail')).toContainText('identifies A');
  await expect(page.locator('#source-trail-heading')).toBeFocused();
  await page.reload();
  expect((await raw(page)).state.history.length).toBe(4);
  await page.locator('#review-evidence').click();
  await expect(page.locator('.evidence-feedback')).toContainText('B repeats A');
  await page.locator('#explain-evidence').click();
  await page
    .locator('#evidence-explanation')
    .fill('Synthetic: A and C each show an 8°F difference. B repeats A.');
  await page.locator('#evidence-next-check').fill('Synthetic: compare other times and courtyards.');
  await page.locator('#evidence-finish').click();
  const pending = page.waitForEvent('download');
  await page.locator('#download-evidence').click();
  const download = await pending;
  const result = JSON.parse(await readFile(await download.path(), 'utf8'));
  expect(result.delivery).toBe('local-only');
  expect(result.labVersion).toBe('1.0.0');
  expect(result.responses.sourcePaths.B).toEqual(['B', 'A']);
  expect(result.responses.explanation).toContain('Synthetic');
  await page.getByRole('link', { name: 'Explore another lab', exact: true }).click();
  await expect(page.locator('.lab-card.blue')).toContainText('Revisit the lab');
  await page.locator('.lab-card.blue a.button').click();
  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('#restart-evidence').click();
  await expect(page.locator('#open-workbench')).toBeVisible();
  expect((await raw(page)).state.complete).toBe(false);
});
test('evidence: mouse drag and undo use the same persisted placements', async ({ page }) => {
  await open(page);
  const handle = page.locator('[data-drag-card="A"]');
  await handle.scrollIntoViewIfNeeded();
  const box = await handle.boundingBox(),
    height = page.viewportSize().height,
    x = box.x + box.width / 2,
    y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x, height - 15, { steps: 8 });
  const target = page.locator('[data-evidence-target="recorded"]');
  await expect
    .poll(
      async () => {
        const b = await target.boundingBox();
        return b.y < height - 150;
      },
      { timeout: 15000 },
    )
    .toBe(true);
  const destination = await target.boundingBox();
  await page.mouse.move(
    destination.x + Math.min(70, destination.width / 2),
    Math.max(90, Math.min(height - 110, destination.y + 75)),
    { steps: 8 },
  );
  await page.mouse.up();
  await expect.poll(async () => (await raw(page)).state.placements.A).toBe('recorded');
  await page.locator('#undo-evidence').click();
  expect((await raw(page)).state.placements.A).toBe('unplaced');
});
test('evidence: broad-claim feedback is revisable and adult guidance is separate', async ({
  page,
}) => {
  await open(page);
  for (const id of ['A', 'B', 'C', 'D']) await place(page, id, 'everywhere');
  await page.locator('#review-evidence').click();
  await expect(page.locator('.evidence-feedback')).toContainText('cannot establish');
  await place(page, 'D', 'aside');
  await expect(page.locator('.evidence-feedback')).toHaveCount(0);
  await page.goto('/#/evidence-guide');
  await expect(
    page.getByRole('heading', { name: 'Worked placements and reasoning' }),
  ).toBeVisible();
  await expect(page.locator('main')).toContainText('not reports of real research');
  await page.getByRole('link', { name: 'Back to the workbench', exact: true }).click();
  expect((await raw(page)).state.placements.D).toBe('aside');
});
test('evidence: blocked storage keeps an oral explanation available for export', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'lunara-labs:1:evidence',
      JSON.stringify({
        version: '1.0.0',
        state: {
          step: 2,
          placements: { A: 'recorded', B: 'recorded', C: 'recorded', D: 'aside' },
          history: [],
          checked: true,
        },
      }),
    );
    Storage.prototype.setItem = function () {
      throw new DOMException('Synthetic failure', 'QuotaExceededError');
    };
  });
  await page.goto('/#/evidence');
  await page.locator('#evidence-discussed').check();
  await expect(page.getByRole('status')).toContainText('saving is unavailable');
  await page.locator('#evidence-finish').click();
  const pending = page.waitForEvent('download');
  await page.locator('#download-evidence').click();
  const result = JSON.parse(await readFile(await (await pending).path(), 'utf8'));
  expect(result.responses.discussed).toBe(true);
  expect(result.completion).toBe('completed');
});

test('evidence: damaged completion returns to the board and revisions revoke completion', async ({
  page,
}) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('lunara-labs:1:evidence'))
      localStorage.setItem(
        'lunara-labs:1:evidence',
        JSON.stringify({
          version: '1.0.0',
          state: {
            step: 3,
            placements: { A: 'unplaced', B: 'unplaced', C: 'unplaced', D: 'unplaced' },
            checked: true,
            complete: true,
            explanation: 'Synthetic rescued explanation',
          },
        }),
      );
  });
  await page.goto('/#/evidence');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Arrange the records beside the claims.',
  );
  for (const id of ['A', 'B', 'C']) await place(page, id, 'recorded');
  await place(page, 'D', 'aside');
  await page.locator('#review-evidence').click();
  await page.locator('#explain-evidence').click();
  await expect(page.locator('#evidence-explanation')).toHaveValue('Synthetic rescued explanation');
  await page.locator('#evidence-discussed').check();
  await page.locator('#evidence-finish').click();
  expect((await raw(page)).state.complete).toBe(true);
  // Model reopening a completed attempt at its board stage.
  await page.evaluate(() => {
    const key = 'lunara-labs:1:evidence',
      saved = JSON.parse(localStorage.getItem(key));
    saved.state.step = 1;
    localStorage.setItem(key, JSON.stringify(saved));
  });
  await page.reload();
  await place(page, 'D', 'everywhere');
  expect((await raw(page)).state.complete).toBe(false);
  await page.getByRole('link', { name: 'All labs', exact: false }).click();
  await expect(page.locator('.lab-card.blue')).toContainText('Continue the lab');
});

test('evidence: interrupted drags cancel without a move or continued auto-scroll', async ({
  page,
}) => {
  await page.clock.install();
  await open(page);
  const handle = page.locator('[data-drag-card="D"]');
  for (const reason of ['escape', 'capture', 'blur', 'stage']) {
    await handle.scrollIntoViewIfNeeded();
    await handle.evaluate((button) =>
      button.addEventListener(
        'gotpointercapture',
        (event) => {
          button.dataset.pointerId = String(event.pointerId);
        },
        { once: true },
      ),
    );
    const box = await handle.boundingBox();
    const x = box.x + box.width / 2,
      y = box.y + box.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x, page.viewportSize().height - 10, { steps: 4 });
    await page.clock.runFor(100);
    if (reason === 'escape') await page.keyboard.press('Escape');
    if (reason === 'capture')
      await handle.evaluate((button) => {
        const id = Number(button.dataset.pointerId);
        if (!button.hasPointerCapture(id)) throw new Error('Expected an active pointer capture');
        button.releasePointerCapture(id);
      });
    if (reason === 'blur') await page.evaluate(() => window.dispatchEvent(new Event('blur')));
    if (reason === 'stage') {
      await page.locator('#workbench-intro').focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('#open-workbench')).toBeVisible();
    }
    await page.mouse.up();
    await page.clock.runFor(100);
    const stopped = await page.evaluate(() => window.scrollY);
    await page.clock.runFor(500);
    expect(await page.evaluate(() => window.scrollY)).toBe(stopped);
    expect((await raw(page)).state.placements.D).toBe('unplaced');
    await expect(page.locator('.is-dragging')).toHaveCount(0);
    if (reason === 'stage') await page.locator('#open-workbench').click();
  }
});
