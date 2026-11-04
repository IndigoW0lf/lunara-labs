import type { SaveStatus } from '../persistence/attemptStorage';

const explanations: Record<Exclude<SaveStatus, 'saved'>, string> = {
  unsupported:
    'This browser has saved work from a version this app cannot open. That saved copy will stay untouched. You can try the lab here, but new work will stay in this tab.',
  unreadable:
    'This app could not read the saved work in this browser. That saved copy will stay untouched. You can try the lab here, but new work will stay in this tab.',
  conflict:
    'The saved work for this lab changed outside this tab. Your work here is still available, but this tab has stopped saving so it does not replace the other copy.',
  unavailable:
    'Browser saving is unavailable. You can keep working in this tab and download a copy before leaving.',
};

function download(text: string, filename: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function SavingNotice({
  persistence,
  state,
}: {
  persistence: { status: SaveStatus; version: string; originalCopy: () => string | null };
  state: unknown;
}) {
  const { status, version, originalCopy } = persistence;
  if (status === 'saved') return null;
  return (
    <aside className="saving-notice sheet peach" aria-label="Saving your work">
      <p role="status">{explanations[status]}</p>
      <p className="small">
        Download this tab’s work before reloading or leaving. These backups stay on your device;
        opening a backup inside the app is planned for a later update.
      </p>
      <div className="button-row">
        <button
          type="button"
          className="button secondary"
          onClick={() =>
            download(JSON.stringify({ version, state }, null, 2), 'lunara-tab-backup.json')
          }
        >
          Download this tab’s work
        </button>
        {(status === 'unsupported' || status === 'unreadable') && (
          <button
            type="button"
            className="button secondary"
            onClick={() => {
              const raw = originalCopy();
              if (raw !== null) download(raw, 'lunara-original-saved-copy.json');
            }}
          >
            Download original saved copy
          </button>
        )}
      </div>
      {status === 'conflict' && (
        <p className="small">After keeping a backup, reload this page to open the saved version.</p>
      )}
    </aside>
  );
}
