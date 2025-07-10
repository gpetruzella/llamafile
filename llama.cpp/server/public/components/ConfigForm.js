import { html, signal, useEffect } from '../index.js';
import { SchemaConverter } from '../json-schema-to-grammar.mjs';

export function ConfigForm({ session, params, userTemplateResetToDefaultAndApply, selectedUserTemplate, userTemplateAutosave }) {
  const updateSession = (el) => session.value = { ...session.value, [el.target.name]: el.target.value }
  const updateParams = (el) => params.value = { ...params.value, [el.target.name]: el.target.value }
  const updateParamsFloat = (el) => params.value = { ...params.value, [el.target.name]: parseFloat(el.target.value) }
  const updateParamsInt = (el) => params.value = { ...params.value, [el.target.name]: Math.floor(parseFloat(el.target.value)) }

  const grammarJsonSchemaPropOrder = signal('')
  const updateGrammarJsonSchemaPropOrder = (el) => grammarJsonSchemaPropOrder.value = el.target.value
  const convertJSONSchemaGrammar = () => {
    try {
      const schema = JSON.parse(params.value.grammar)
      const converter = new SchemaConverter(
        grammarJsonSchemaPropOrder.value
          .split(',')
          .reduce((acc, cur, i) => ({ ...acc, [cur.trim()]: i }), {})
      )
      converter.visit(schema, '')
      params.value = {
        ...params.value,
        grammar: converter.formatGrammar(),
      }
    } catch (e) {
      alert(`Convert failed: ${e.message}`)
    }
  }

  const FloatField = ({ label, max, min, name, step, value }) => {
    return html`
      <div>
        <label for="${name}">${label}</label>
        <input type="range" id="${name}" min="${min}" max="${max}" step="${step}" name="${name}" value="${value}" oninput=${updateParamsFloat} />
        <span>${value}</span>
      </div>
    `
  };

  const IntField = ({ label, max, min, name, value }) => {
    return html`
      <div>
        <label for="${name}">${label}</label>
        <input type="range" id="${name}" min="${min}" max="${max}" name="${name}" value="${value}" oninput=${updateParamsInt} />
        <span>${value}</span>
      </div>
    `
  };

  const userTemplateReset = (e) => {
    e.preventDefault();
    userTemplateResetToDefaultAndApply()
  }

  const UserTemplateResetButton = () => {
    if (selectedUserTemplate.value.name == 'default') {
      return html`
        <button disabled>Using default template</button>
      `
    }

    return html`
      <button type="button" onclick=${userTemplateReset}>Reset all to default</button>
    `
  };

  useEffect(() => {
    // autosave template on every change
    userTemplateAutosave()
  }, [session.value, params.value])

  const GrammarControl = () => (
    html`
      <div>
        <label for="template">Grammar</label>
        <textarea id="grammar" name="grammar" placeholder="Use gbnf or JSON Schema+convert" value="${params.value.grammar}" rows=4 oninput=${updateParams}/>
        <input type="text" name="prop-order" placeholder="order: prop1,prop2,prop3" oninput=${updateGrammarJsonSchemaPropOrder} />
        <button type="button" onclick=${convertJSONSchemaGrammar}>Convert JSON Schema</button>
      </div>
      `
  );

  const PromptControlFieldSet = () => (
    html`
    <fieldset>
      <div>
        <label htmlFor="prompt">Prompt</label>
        <textarea type="text" name="prompt" value="${session.value.prompt}" oninput=${updateSession}/>
      </div>
    </fieldset>
    `
  );

  const ChatConfigFormFields = () => (
    html`
      ${PromptControlFieldSet()}

      <fieldset class="two">
        <div>
          <label for="user">User name</label>
          <input type="text" name="user" value="${session.value.user}" oninput=${updateSession} />
        </div>

        <div>
          <label for="bot">Bot name</label>
          <input type="text" name="char" value="${session.value.char}" oninput=${updateSession} />
        </div>
      </fieldset>

      <fieldset>
        <div>
          <label for="template">Prompt template</label>
          <textarea id="template" name="template" value="${session.value.template}" rows=4 oninput=${updateSession}/>
        </div>

        <div>
          <label for="template">Chat history template</label>
          <textarea id="historyTemplate" name="historyTemplate" value="${session.value.historyTemplate}" rows=1 oninput=${updateSession}/>
        </div>

        ${GrammarControl()}
      </fieldset>
  `
  );

  const CompletionConfigFormFields = () => (
    html`
      ${PromptControlFieldSet()}
      <fieldset>${GrammarControl()}</fieldset>
    `
  );

  return html`
    <form>
      <fieldset class="two">
        <${UserTemplateResetButton}/>
        <div>
          <label class="slim"><input type="radio" name="type" value="chat" checked=${session.value.type === "chat"} oninput=${updateSession} /> Chat</label>
          <label class="slim"><input type="radio" name="type" value="completion" checked=${session.value.type === "completion"} oninput=${updateSession} /> Completion</label>
        </div>
      </fieldset>

      ${session.value.type === 'chat' ? ChatConfigFormFields() : CompletionConfigFormFields()}

      <fieldset class="two">
        ${IntField({ label: "Predictions", max: 2048, min: -1, name: "n_predict", value: params.value.n_predict })}
        ${FloatField({ label: "Temperature", max: 2.0, min: 0.0, name: "temperature", step: 0.01, value: params.value.temperature })}
        ${FloatField({ label: "Penalize repeat sequence", max: 2.0, min: 0.0, name: "repeat_penalty", step: 0.01, value: params.value.repeat_penalty })}
        ${IntField({ label: "Consider N tokens for penalize", max: 2048, min: 0, name: "repeat_last_n", value: params.value.repeat_last_n })}
        ${IntField({ label: "Top-K sampling", max: 100, min: -1, name: "top_k", value: params.value.top_k })}
        ${FloatField({ label: "Top-P sampling", max: 1.0, min: 0.0, name: "top_p", step: 0.01, value: params.value.top_p })}
        ${FloatField({ label: "Min-P sampling", max: 1.0, min: 0.0, name: "min_p", step: 0.01, value: params.value.min_p })}
      </fieldset>
      <details>
        <summary>More options</summary>
        <fieldset class="two">
          ${FloatField({ label: "TFS-Z", max: 1.0, min: 0.0, name: "tfs_z", step: 0.01, value: params.value.tfs_z })}
          ${FloatField({ label: "Typical P", max: 1.0, min: 0.0, name: "typical_p", step: 0.01, value: params.value.typical_p })}
          ${FloatField({ label: "Presence penalty", max: 1.0, min: 0.0, name: "presence_penalty", step: 0.01, value: params.value.presence_penalty })}
          ${FloatField({ label: "Frequency penalty", max: 1.0, min: 0.0, name: "frequency_penalty", step: 0.01, value: params.value.frequency_penalty })}
        </fieldset>
        <hr />
        <fieldset class="three">
          <div>
            <label><input type="radio" name="mirostat" value="0" checked=${params.value.mirostat == 0} oninput=${updateParamsInt} /> no Mirostat</label>
            <label><input type="radio" name="mirostat" value="1" checked=${params.value.mirostat == 1} oninput=${updateParamsInt} /> Mirostat v1</label>
            <label><input type="radio" name="mirostat" value="2" checked=${params.value.mirostat == 2} oninput=${updateParamsInt} /> Mirostat v2</label>
          </div>
          ${FloatField({ label: "Mirostat tau", max: 10.0, min: 0.0, name: "mirostat_tau", step: 0.01, value: params.value.mirostat_tau })}
          ${FloatField({ label: "Mirostat eta", max: 1.0, min: 0.0, name: "mirostat_eta", step: 0.01, value: params.value.mirostat_eta })}
        </fieldset>
        <fieldset>
          ${IntField({ label: "Show Probabilities", max: 10, min: 0, name: "n_probs", value: params.value.n_probs })}
        </fieldset>
        <fieldset>
          ${IntField({ label: "Min Probabilities from each Sampler", max: 10, min: 0, name: "min_keep", value: params.value.min_keep })}
        </fieldset>
        <fieldset>
          <label for="api_key">API Key</label>
          <input type="text" name="api_key" value="${params.value.api_key}" placeholder="Enter API key" oninput=${updateParams} />
        </fieldset>
      </details>
    </form>
  `
}
