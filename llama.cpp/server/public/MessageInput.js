import { html, useSignal } from './index.js';
import { llama } from './completion.js';

export function MessageInput({ generating, stop, chat, uploadImage, reset }) {
  const message = useSignal("");

  const submit = (e) => {
    stop(e);
    chat(message.value);
    message.value = "";
  }

  const enterSubmits = (event) => {
    if (event.which === 13 && !event.shiftKey) {
      submit(event);
    }
  }

  return html`
    <form onsubmit=${submit}>
      <div>
        <textarea
           className=${generating.value ? "loading" : null}
           oninput=${(e) => message.value = e.target.value}
           onkeypress=${enterSubmits}
           placeholder="Say something..."
           rows=2
           type="text"
           value="${message}"
        />
      </div>
      <div class="right">
        <button type="submit" disabled=${generating.value}>Send</button>
        <button type="button" onclick=${uploadImage}>Upload Image</button>
        <button type="button" onclick=${stop} disabled=${!generating.value}>Stop</button>
        <button type="button" onclick=${reset}>Reset</button>
      </div>
    </form>
  `
}
