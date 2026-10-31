import { useLayoutEffect, useRef } from 'react';
export function EvidenceGuide() {
  const main = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    document.title = 'Evidence Workbench · Parent & teaching guide';
    const h = main.current?.querySelector('h1');
    if (h) {
      h.tabIndex = -1;
      h.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, []);
  return (
    <main id="main" tabIndex={-1} className="about" ref={main}>
      <a href="#/evidence">← Return to Evidence Workbench</a>
      <p className="eyebrow">Parent &amp; teaching guide · includes explanations</p>
      <h1>Help them connect a claim with the records.</h1>
      <p>
        This companion uses the courtyard practice case from{' '}
        <em>The Evidence Trail — How Do You Know?</em>, learner pages 27–28 and guide page 10. The
        practice logs and their numbers were created for the study; they are not reports of real
        research.
      </p>
      <h2>Before you begin</h2>
      <p>
        The learner will compare short records, follow where information came from, and explain how
        far an observation can take us. They need to be able to read the cards or listen while you
        read, then explain their reasoning in writing or conversation. You can scribe their words
        when writing would get in the way of the evidence task.
      </p>
      <p>
        You need a browser on a device with a pointer, touch screen, or keyboard. No account or
        outside search is needed. Each record has a destination menu, so dragging is optional.
        Progress stays in that browser; download the field notes before starting over for another
        learner. For a paper version of the task, copy the four records and claim headings onto
        scraps and move them at a table.
      </p>
      <h2>A useful rhythm</h2>
      <p>
        Begin with the question, read all four records, and let the learner make a first arrangement
        before opening the feedback. The board is a natural stopping point because its positions and
        undo history are saved. When you return, ask them to explain one placement before moving on
        to the final notes. There is no countdown.
      </p>
      <h2>Walk through the investigation</h2>
      <ol className="numbered-list">
        <li>
          <strong>Start here.</strong> Read the difference between a claim, a record, and evidence.
          An initial thought can be brief; it is something to return to after the investigation.
        </li>
        <li>
          <strong>Arrange the records.</strong> Ask which words or measurements made them choose a
          place. The source-trail control lets them inspect where a repeated report came from. Undo
          reverses board movement without removing their written reflections.
        </li>
        <li>
          <strong>Compare the feedback.</strong> Read the explanation for each placement. They can
          revise the board and check it again. The feedback supplies worked reasoning after their
          attempt; it does not judge the quality of their open written explanation.
        </li>
        <li>
          <strong>Explain and keep the notes.</strong> Ask for a conclusion using the source letters
          and a useful next check. They can type, dictate, or discuss aloud and mark that option.
          Completion records participation, not mastery.
        </li>
      </ol>
      <h2>Worked placements and reasoning</h2>
      <p>
        <strong>A and C fit the claim about these recorded days.</strong> A reports 74°F in shade
        and 82°F in sun on October 1. C reports 76°F and 84°F on October 2. Each shaded reading is
        8°F lower. These are separately collected records, using separate equipment, but both
        concern the same courtyard at noon.
      </p>
      <p>
        <strong>B can sit beside that claim as a repeated report.</strong> It explicitly reprints
        A’s measurements. Following B → A shows why counting A and B as two independently collected
        sets would exaggerate the evidence. A and C supply the two measurement records in this case.
      </p>
      <p>
        <strong>D belongs aside for this question.</strong> It concerns seedling growth in a
        greenhouse and contains no courtyard air-temperature readings. Its age is not the reason to
        set it aside; what it measures does not answer this question.
      </p>
      <p>
        <strong>No supplied record establishes the broader claim.</strong> Two days at noon in one
        courtyard cannot tell us what happens in every courtyard at every time or show that shade
        alone caused every difference. Each log says the sensors were checked, but neither explains
        those checks. Do not add a claim that their calibration or precision was verified.
      </p>
      <h2>Possible explanations</h2>
      <p>
        “A and C show lower recorded air temperatures in the shaded location at noon on both dates.
        The difference was 8°F each day. B repeats A, and D does not measure the temperature in this
        courtyard.” An answer can be worded differently if it keeps those relationships and limits.
      </p>
      <p>
        A useful next check names additional times or courtyards and explains why they matter. For
        example: “Take paired readings at other times and in more courtyards, because the current
        logs cover only noon in one place.” Further questions could examine surface materials,
        weather, locations, or what the sensor checks involved.
      </p>
      <h2>Prompts when they get stuck</h2>
      <p>
        Try “What did this source actually measure?”, “Where did the newsletter get those numbers?”,
        or “Does this sentence stay with the two recorded days?” Let the learner point to the record
        before helping them phrase an answer. A different placement is useful to discuss when they
        can explain what they think the record contributes.
      </p>
      <p>
        To connect with everyday reading, compare an original notice with a message quoting it. Ask
        whether the second message adds a new observation or helps you find the first record. Do not
        turn the practice temperatures into a real-world research finding.
      </p>
      <a className="button" href="#/evidence">
        Back to the workbench
      </a>
    </main>
  );
}
