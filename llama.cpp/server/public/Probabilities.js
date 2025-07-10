import { html } from './index.js';
import { Popover } from './Popover.js';

const probColor = (p) => {
  const r = Math.floor(192 * (1 - p));
  const g = Math.floor(192 * p);
  return `rgba(${r},${g},0,0.3)`;
}

export const Probabilities = (params) => {
  return params.data.map(msg => {
    const { completion_probabilities } = msg;
    if (
      !completion_probabilities ||
      completion_probabilities.length === 0
    ) return msg.content

    if (completion_probabilities.length > 1) {
      // Not for byte pair
      if (completion_probabilities[0].content.startsWith('byte: \\')) return msg.content

      const splitData = completion_probabilities.map(prob => ({
        content: prob.content,
        completion_probabilities: [prob]
      }))
      return html`<${Probabilities} data=${splitData} />`
    }

    const { probs, content } = completion_probabilities[0]
    const found = probs.find(p => p.tok_str === msg.content)
    const pColor = found ? probColor(found.prob) : 'transparent'

    const popoverChildren = html`
      <div class="prob-set">
        ${probs.map((p, index) => {
      return html`
            <div
              key=${index}
              title=${`prob: ${p.prob}`}
              style=${{
          padding: '0.3em',
          backgroundColor: p.tok_str === content ? probColor(p.prob) : 'transparent'
        }}
            >
              <span>${p.tok_str}: </span>
              <span>${Math.floor(p.prob * 100)}%</span>
            </div>
          `
    })}
      </div>
    `

    return html`
      <${Popover} style=${{ backgroundColor: pColor }} popoverChildren=${popoverChildren}>
        ${msg.content.match(/\n/gim) ? html`<br />` : msg.content}
      </>
    `
  });
}
