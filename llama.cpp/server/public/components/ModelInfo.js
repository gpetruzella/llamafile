import { html } from '../index.js';

export const ModelProcessingInfo = ({ llamaStats }) => {
  if (!llamaStats.value) {
    return html`<span/>`
  }
  return html`
    <span>
      prompt evaluation speed is ${llamaStats.value.timings.prompt_per_second_jart.toFixed(2)} prompt tokens evaluated per second
    </span>
  `
}

export const ModelGenerationInfo = ({ llamaStats }) => {
  if (!llamaStats.value) {
    return html`<span/>`
  }
  return html`
    <span>
      ${llamaStats.value.tokens_predicted} tokens predicted, ${llamaStats.value.timings.predicted_per_token_ms.toFixed()} ms per token, ${llamaStats.value.timings.predicted_per_second.toFixed(2)} tokens per second
    </span>
  `
}
