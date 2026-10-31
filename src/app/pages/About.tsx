import { useLayoutEffect, useRef } from 'react';
export function About() {
  const main = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    document.title = 'How it works · Lunara Labs';
    const h = main.current?.querySelector('h1');
    if (h) {
      h.tabIndex = -1;
      h.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, []);
  return (
    <main id="main" tabIndex={-1} ref={main} className="about">
      <p className="eyebrow">Lunara Labs</p>
      <h1>We’ll try something, look at what happened, and work out what we can say about it.</h1>
      <p>
        Each lab begins with a question and gives you something to investigate. You might compare
        messages to see how a story changed, or try a task twice to notice how the two attempts
        felt. The directions will walk you through what to do, and you’ll have places to explain
        your thinking along the way.
      </p>
      <div className="sheet sage">
        <h2>How the lab fits with your other learning</h2>
        <ol className="numbered-list">
          <li>
            <strong>If you’re using the lab on its own,</strong> you’ll find the instructions and
            information you need here. You can work through it independently or talk it through with
            someone beside you.
          </li>
          <li>
            <strong>If you’re using a Lunara curriculum,</strong> the matching lab gives you another
            way to explore part of the study. The printable includes the surrounding lessons,
            further activities, and teaching guidance.
          </li>
          <li>
            <strong>If you use Lunara Quest,</strong> the planned connection will let a parent
            assign a lab and keep the learner’s work with their other records. That connection is
            still being developed.
          </li>
        </ol>
      </div>
      <h2>About the voices</h2>
      <p>
        The character voices are AI-generated. You can read every message on the phone as well as
        listen.
      </p>
      <h2>Keeping the work you do here</h2>
      <p>
        As you move through a lab, this browser remembers your place and the answers you enter. When
        you reach the end, you can print your field notes or download the results to keep a copy.
        They are not sent to Quest in this version.
      </p>
      <p>
        One browser holds one attempt for each lab. If someone else wants a turn, download the first
        learner’s notes before starting over, because a new attempt will replace the saved one. Your
        progress also stays with this browser rather than following you to another device.
      </p>
      <div className="button-row">
        <a className="button" href="#/">
          Explore the labs
        </a>
      </div>
    </main>
  );
}
