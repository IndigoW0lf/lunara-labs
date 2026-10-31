import { useLayoutEffect, useRef, useState } from 'react';
import { restoreProgress } from '../../domain/data.mjs';
import { labCatalog as labs } from '../../domain/catalog.mjs';
import { restoreBoard } from '../../labs/evidence/model.mjs';
import { Icon, Portrait } from '../../components/Phone';
function readStatuses(): Record<string, { step: number; complete: boolean }> {
  return Object.fromEntries(
    Object.keys(labs).map((slug) => {
      try {
        const raw = JSON.parse(localStorage.getItem('lunara-labs:1:' + slug) || 'null');
        return [
          slug,
          slug === 'evidence'
            ? restoreBoard(raw)
            : restoreProgress(raw, { step: 0, complete: false }),
        ];
      } catch {
        return [slug, { step: 0, complete: false }];
      }
    }),
  );
}
export function Catalog({ hash }: { hash: string }) {
  const [statuses] = useState(readStatuses),
    main = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    document.title = 'Interactive investigations · Lunara Labs';
    const target = main.current?.querySelector<HTMLElement>(hash === '#labs' ? '#labs h2' : 'h1');
    if (target) {
      target.tabIndex = -1;
      target.focus({ preventScroll: true });
      if (hash === '#labs')
        main.current?.querySelector('#labs')?.scrollIntoView({ block: 'start' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [hash]);
  return (
    <main id="main" tabIndex={-1} className="home" ref={main}>
      <section className="hero">
        <div>
          <p className="eyebrow">Welcome to Lunara Labs</p>
          <h1>Let’s explore how we notice things and share information.</h1>
          <p className="lead">
            When you hear the same story from several people, you might wonder how much of it came
            from the same place. And when something interrupts you, you may need a moment to find
            where you left off. These labs give you a way to explore both situations and explain
            what you notice.
          </p>
          <p className="small muted">
            Choose a lab that interests you, and we’ll walk through it together. You can use it on
            its own or alongside the matching Lunara curriculum.
          </p>
          <div className="button-row">
            <a className="button" href="#labs">
              Choose an investigation <span aria-hidden="true">↓</span>
            </a>
            <a className="text-button small" href="#/about">
              How the labs work
            </a>
          </div>
        </div>
        <div className="hero-art illustrated-hero">
          <img src="assets/attention-desk.png" alt="A watercolor desk beside a sunny window" />
          <a
            className="hero-phone-invite"
            href="#/attention"
            aria-label="Pick up the practice phone and open The Attention Trap"
          >
            <span className="mini-phone-face">
              <Icon name="message" />
              <Portrait id="guide" className="hero-guide-person" />
              <strong>Something just arrived…</strong>
              <span>Pick up the phone ↗</span>
            </span>
          </a>
        </div>
      </section>
      <section id="labs">
        <div className="lab-section-head">
          <h2>Choose your first investigation</h2>
          <p>Three investigations from the Lunara curriculum library</p>
        </div>
        <div className="lab-grid">
          {Object.entries(labs).map(([slug, lab]) => (
            <article key={slug} className={'lab-card ' + lab.color}>
              <div className="lab-card-visual topic-cover-visual">
                <img className="lab-world-preview" src={lab.cover} alt={lab.coverAlt} />
              </div>
              <div className="lab-card-body">
                <span className="cover-area">{lab.area}</span>
                <h3>{lab.title}</h3>
                <p>{lab.description}</p>
                <div className="card-bottom">
                  <a className="button" href={'#/' + slug}>
                    {statuses[slug].complete
                      ? 'Revisit the lab'
                      : statuses[slug].step > 0
                        ? 'Continue the lab'
                        : 'Open the lab'}{' '}
                    <span aria-hidden="true">↗</span>
                  </a>
                  <span className="save-status">
                    {statuses[slug].complete
                      ? 'Field notes saved'
                      : statuses[slug].step > 0
                        ? 'In progress'
                        : 'Explore at your pace'}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <aside className="connection-note">
        <strong>Keep exploring with the curriculum.</strong>
        <p>
          Each lab connects to a printable study with more to read, try, and discuss. For now, your
          work is saved in this browser. The planned Quest connection will give families another way
          to assign a lab and keep its results with their other learning records.
        </p>
      </aside>
    </main>
  );
}
