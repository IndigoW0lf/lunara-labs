# Working on Lunara Labs

Read [AGENTS.md](AGENTS.md), [README.md](README.md), and [PRIVACY.md](PRIVACY.md) first.

This is a static React + TypeScript + Vite app in staged migration. The shared shell and Rumor screens/state are React. Attention/catalog/About still use an isolated legacy controller. Run `npm ci`, then `npm run dev`; verify with `npm run build`, `npm run check`, and `npm run test:browser`. Read [the migration plan](docs/REACT-MIGRATION.md) before extending the adapter. Existing lessons, illustrations, and narration run without API keys or a backend.

Use synthetic data. Preserve the selected voice assets and saved attempt versions. Keep data collection, credentials, external integrations, and hosting account configuration out of routine development.

Choose scoped work from [docs/ROADMAP.md](docs/ROADMAP.md). Explain the resulting behavior, checks performed, and any verification still pending. Never report a learner trial, device check, or production integration as complete without evidence.
