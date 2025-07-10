import { html } from './index.js';

// Syntax Highlighting, condensed down from https://github.com/speed-highlight/core
// Following is a number of regexps that capture some generic highlightable syntax
// such as "strings" or /* comments */. These regexps are then utilizied by the
// language definitions below, assigning each regexp to a `type`. The type maps
// to a sh-* css class.

const SH_REGEXP = {
  STRING: /("|')(\\[^]|(?!\1)[^\r\n\\])*\1?/g,
  STRING_BACKTICK: /`((?!`)[^]|\\[^])*`?/g,
  COMMENT: /\/\/.*\n?|\/\*((?!\*\/)[^])*(\*\/)?/g,
  COMMENT_HASH: /#.*\n?/g,
  COMMENT_PYTHON: /("""|''')(\\[^]|(?!\1)[^])*\1?/g,
  PREPROC: /#\s*\w+(\\\n|[^\n])*\n?/g,
  COMMENT_DASH: /--.*\n?/g,
  COMMENT_XML: /&lt;!--((?!--&gt;)[^])*--&gt;/g,
  KW: /\b(set|get|as|break|case|const|continue|default|delete|do|else|export|for|from|function|goto|if|import|extern|in|let|var|null|of|package|return|static|switch|typeof|void|while)\b/g,
  CLASS: /\b(class|constructor|extends|implements|interface|new|private|protected|public|super|this|abstract|final|virtual|instanceof)\b/g,
  EXCEPTION: /\b(try|throw|throws|catch|finnaly)\b/g,
  BOOL: /\b(true|false)\b/g,
  BOOL_PYTHON: /\b(True|False)\b/g,
  KW_ASYNC: /\b(async|await|yield)\b/g,
  KW_JS: /\b(with|NaN|debugger|undefined)\b/g,
  KW_RS: /\b(crate|fn|impl|loop|match|mod|move|mut|pub|ref|self|Self|trait|type|unsafe|use|where|dyn|become|box|macro|override|priv|unsized)\b/g,
  KW_LUA: /\b(and|elseif|end|local|nil|not|or|repeat|then|until)\b/g,
  KW_PYTHON: /\b(and|as|assert|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|in|is|lambda|nonlocal|not|or|pass|raise|return|try|while|with|yield)\b/g,
  TYPES: /\b(char|double|enum|float|int|signed|unsigned|struct|union)\b/g,
  TYPES_SQL: /\b(varchar|(tiny|medium|long|big)(text|blob|int)|integer|decimal|boolean)\b/g,
  REGEX: /\/((?!\/)[^\r\n\\]|\\.)+\/[dgimsuy]*/g,
  NUM: /(\.e?|\b)\d(e-|[\d.oxa-fA-F_])*(\.|\b)/g,
  DEF: /\b([A-Z][A-Z_]*)\b/g,
  OP: /(&amp;|&lt;|&gt;|[/*+:?|%^~=!,.^-])+/g,
  XML_ELEM: /&lt;\w+|&lt;\/\w+|&gt;/g
};

const SH_LANGS = {
  generic: [
    {type: 'c', match: SH_REGEXP.COMMENT},
    {type: 's', match: SH_REGEXP.STRING},
    {type: 'k', match: SH_REGEXP.BOOL},
    {type: 'k', match: SH_REGEXP.KW},
    {type: 'n', match: SH_REGEXP.NUM},
    {type: 'n', match: SH_REGEXP.DEF},
    {type: 'p', match: SH_REGEXP.OP},
  ],
  py: [
    {type: 'c', match: SH_REGEXP.COMMENT_PYTHON},
    {type: 'c', match: SH_REGEXP.COMMENT_HASH},
    {type: 's', match: SH_REGEXP.STRING},
    {type: 'k', match: SH_REGEXP.BOOL_PYTHON},
    {type: 'k', match: SH_REGEXP.KW_PYTHON},
    {type: 'n', match: SH_REGEXP.NUM},
    {type: 'n', match: SH_REGEXP.DEF},
    {type: 'p', match: SH_REGEXP.OP},
  ],
  js: [
    {type: 'c', match: SH_REGEXP.COMMENT},
    {type: 's', match: SH_REGEXP.STRING},
    {type: 's', match: SH_REGEXP.STRING_BACKTICK},
    {type: 'k', match: SH_REGEXP.KW},
    {type: 'k', match: SH_REGEXP.EXCEPTION},
    {type: 'k', match: SH_REGEXP.BOOL},
    {type: 'k', match: SH_REGEXP.CLASS},
    {type: 'k', match: SH_REGEXP.KW_ASYNC},
    {type: 'k', match: SH_REGEXP.KW_JS},
    {type: 'r', match: SH_REGEXP.REGEX},
    {type: 'n', match: SH_REGEXP.NUM},
    {type: 'n', match: SH_REGEXP.DEF},
    {type: 'p', match: SH_REGEXP.OP},
  ],
  json: [
    {type: 'c', match: SH_REGEXP.COMMENT},
    {type: 's', match: SH_REGEXP.STRING},
    {type: 'n', match: SH_REGEXP.NUM},
    {type: 'k', match: SH_REGEXP.BOOL},
  ],
  bash: [
    {type: 's', match: SH_REGEXP.STRING},
    {type: 'c', match: SH_REGEXP.COMMENT_HASH},
    {type: 'p', match: SH_REGEXP.OP},
  ],
  c: [
    {type: 'c', match: SH_REGEXP.COMMENT},
    {type: 's', match: SH_REGEXP.STRING},
    {type: 'k', match: SH_REGEXP.KW},
    {type: 'k', match: SH_REGEXP.BOOL},
    {type: 'k', match: SH_REGEXP.TYPES},
    {type: 'n', match: SH_REGEXP.NUM},
    {type: 'n', match: SH_REGEXP.PREPROC},
    {type: 'n', match: SH_REGEXP.DEF},
    {type: 'p', match: SH_REGEXP.OP},
  ],
  cpp: [
    {type: 'c', match: SH_REGEXP.COMMENT},
    {type: 's', match: SH_REGEXP.STRING},
    {type: 'k', match: SH_REGEXP.KW},
    {type: 'k', match: SH_REGEXP.EXCEPTION},
    {type: 'k', match: SH_REGEXP.BOOL},
    {type: 'k', match: SH_REGEXP.CLASS},
    {type: 'k', match: SH_REGEXP.TYPES},
    {type: 'n', match: SH_REGEXP.NUM},
    {type: 'n', match: SH_REGEXP.DEF},
    {type: 'p', match: SH_REGEXP.OP},
  ],
  rs: [
    {type: 'c', match: SH_REGEXP.COMMENT},
    {type: 's', match: SH_REGEXP.STRING},
    {type: 'k', match: SH_REGEXP.KW},
    {type: 'r', match: SH_REGEXP.REGEX},
    {type: 'k', match: SH_REGEXP.EXCEPTION},
    {type: 'k', match: SH_REGEXP.BOOL},
    {type: 'k', match: SH_REGEXP.CLASS},
    {type: 'k', match: SH_REGEXP.TYPES},
    {type: 'k', match: SH_REGEXP.KW_ASYNC},
    {type: 'k', match: SH_REGEXP.KW_RS},
    {type: 'n', match: SH_REGEXP.NUM},
    {type: 'n', match: SH_REGEXP.DEF},
    {type: 'p', match: SH_REGEXP.OP},
  ],
  lua: [
    {type: 'c', match: SH_REGEXP.COMMENT_DASH},
    {type: 'c', match: SH_REGEXP.COMMENT_HASH},
    {type: 's', match: SH_REGEXP.STRING},
    {type: 'k', match: SH_REGEXP.BOOL},
    {type: 'k', match: SH_REGEXP.KW},
    {type: 'k', match: SH_REGEXP.KW_LUA},
    {type: 'n', match: SH_REGEXP.NUM},
    {type: 'n', match: SH_REGEXP.DEF},
    {type: 'p', match: SH_REGEXP.OP},
  ],
  java: [
    {type: 'c', match: SH_REGEXP.COMMENT},
    {type: 's', match: SH_REGEXP.STRING},
    {type: 'n', match: SH_REGEXP.NUM},
    {type: 'n', match: SH_REGEXP.DEF},
    {type: 'k', match: SH_REGEXP.KW},
    {type: 'k', match: SH_REGEXP.EXCEPTION},
    {type: 'k', match: SH_REGEXP.BOOL},
    {type: 'k', match: SH_REGEXP.CLASS},
    {type: 'k', match: SH_REGEXP.TYPES},
  ],
  sql: [
    {type: 'c', match: SH_REGEXP.COMMENT_DASH},
    {type: 's', match: SH_REGEXP.STRING},
    {type: 's', match: SH_REGEXP.STRING_BACKTICK},
    {type: 'r', match: SH_REGEXP.TYPES},
    {type: 'r', match: SH_REGEXP.TYPES_SQL},
    {type: 'n', match: SH_REGEXP.NUM},
    {type: 'k', match: SH_REGEXP.DEF},
    {type: 'p', match: SH_REGEXP.OP},
  ],
  html: [
    {type: 's', match: SH_REGEXP.STRING},
    {type: 'c', match: SH_REGEXP.COMMENT_XML},
    {type: 'k', match: SH_REGEXP.XML_ELEM},
  ],
  xml: [
    {type: 's', match: SH_REGEXP.STRING},
    {type: 'c', match: SH_REGEXP.COMMENT_XML},
    {type: 'k', match: SH_REGEXP.XML_ELEM},
  ]
};
SH_LANGS.python = SH_LANGS.py;
SH_LANGS.rust = SH_LANGS.rs;
SH_LANGS.javascript = SH_LANGS.js;

const Syntaxhighlightish = (src, lang) => {
  let html = '';
  const cache = [];
  const rules = (SH_LANGS[lang] || SH_LANGS.generic).slice();

  let i = 0;
  while (i < src.length) {
    let fm = null;
    let ft = '';
    for (let r = rules.length; r-- > 0;) {
      const token = rules[r];

      if (cache[r] === undefined || cache[r].index < i) {
        token.match.lastIndex = i;
        const match = token.match.exec(src);
        if (match === null) {
          rules.splice(r, 1);
          cache.splice(r, 1);
          continue;
        }
        cache[r] = match;
      }
      if (cache[r][0] && (fm === null || cache[r].index <= fm.index)) {
        fm = cache[r];
        ft = token.type;
      }
    }
    if (fm === null) {
      break;
    }
    if (i !== fm.index) {
      html += src.substring(i, fm.index);
    }
    i = fm.index + fm[0].length;
    html += '<span class="sh-'+ft+'">'+fm[0]+'</span>';
  }
  html += src.substring(i, src.length);
  return html;
};

// This transforms _some_ markdown to html by replacing code blocks and
// urls with a placeholder, so that any markdown within these already
// matched blocks won't be processed again.

export const Markdownish = (params) => {
  const blocks = [];
  const md = params.text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

    // Multiline code - be liberal with the closing ``` here: we just assume
    // it will be closed eventually. This makes the code formatting and
    // highlighting work while we still receive more tokens.
    .replace(/```(\w*)\n([\s\S]*?)(```|$)/g, (m, lang, code) => {
      const id = '<block'+blocks.length+'>';
      const block = lang.length ? Syntaxhighlightish(code, lang) : code;
      blocks.push('<pre><code class="shl-'+lang+'">'+block+'</code></pre>');
      return id;
    })

    // Inline code
    .replace(/`(.*?)`/g, (m, code) => {
      const id = '<block'+blocks.length+'>';
      blocks.push('<code class="inline">'+code+'</code>');
      return id;
    })

    // Urls. These are often wrapped in <> angle brackets
    .replace(/(\b|&lt;)((https?:\/\/(?:www\.)?|www\.)([^\s]+\([^\s]+[^!,.:\s]|[^(\s]+[^)!,.:\s]))/ig, (m, pre, url, httpwww, hostandpath) => {
      const id = '<block'+blocks.length+'>';
      if (httpwww === 'www.') {
        url = 'http://' + url;
      }
      if (pre === '&lt;') {
        hostandpath = hostandpath.replace(/&gt;$/g, '');
        url = url.replace(/&gt;$/g, '');
      }
      blocks.push('<a href="'+url+'">'+hostandpath+'</a>');
      return id;
    })

    // Headlines, emphasis and line breaks
    .replace(/^#{1,6} (.*)$/gim, '<h3>$1</h3>')
    .replace(/(^|\s)(__|\*\*)(.*?)\2($|\s|[.?!])/g, '$1<strong>$3</strong>$4')
    .replace(/(^|\s)(_|\*)(.*?)\2($|\s|[.?!])/g, '$1<em>$3</em>$4')
    .replace(/\n/gim, '<br />')

    // Paste the extracted blocks back in again
    .replace(/<block(\d+)>/g, (m, index) => blocks[index]);
  return html`<span dangerouslySetInnerHTML=${{ __html: md }} />`;
};
