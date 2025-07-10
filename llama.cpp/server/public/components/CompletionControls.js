import { html } from '../index.js';

export function CompletionControls({ generating, stop, runCompletion, reset }) {
  const submit = (e) => {
    stop(e);
    runCompletion();
  }
  return html`
    <div>
      <button onclick=${submit} type="button" disabled=${generating.value}>Start</button>
      <button type="button" onclick=${stop} disabled=${!generating.value}>Stop</button>
      <button type="button" onclick=${reset}>Reset</button>
    </div>`;
}
