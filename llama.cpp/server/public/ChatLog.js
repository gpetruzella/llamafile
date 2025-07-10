import { html, useEffect, useRef } from './index.js';
import { Probabilities } from './Probabilities.js';
import { Markdownish } from './Markdownish.js';

export function ChatLog({ session, params, template }) {
  const messages = session.value.transcript;
  const container = useRef(null);

  useEffect(() => {
    // scroll to bottom (if needed)
    const parent = container.current.parentElement;
    if (parent && parent.scrollHeight <= parent.scrollTop + parent.offsetHeight + 300) {
      parent.scrollTo(0, parent.scrollHeight);
    }
  }, [messages]);

  const isCompletionMode = session.value.type === 'completion';
  const chatLine = ([user, data], index) => {
    let message;
    const isArrayMessage = Array.isArray(data);
    if (params.value.n_probs > 0 && isArrayMessage) {
      message = html`<${Probabilities} data=${data} />`;
    } else {
      const text = isArrayMessage ?
        data.map(msg => msg.content).join('').replace(/^\s+/, '') :
        data;
      message = isCompletionMode ?
        text :
        html`<${Markdownish} text=${template(text)} />`;
    }
    if (user) {
      return html`<p key=${index}><strong>${template(user)}:</strong> ${message}</p>`;
    } else {
      return isCompletionMode ?
        html`<span key=${index}>${message}</span>` :
        html`<p key=${index}>${message}</p>`;
    }
  };

  const handleCompletionEdit = (e) => {
    session.value.prompt = e.target.innerText;
    session.value.transcript = [];
  }

  return html`
    <div id="chat" ref=${container} key=${messages.length}>
      <img style="width: 60%;${!session.value.image_selected ? `display: none;` : ``}" src="${session.value.image_selected}"/>
      <span contenteditable=${isCompletionMode} ref=${container} oninput=${handleCompletionEdit}>
        ${messages.flatMap(chatLine)}
      </span>
    </div>`;
}
