export type XmlAttribute = { name: string; value: string };

export type XmlNode =
  | { type: 'element'; name: string; attributes: XmlAttribute[]; children: XmlNode[] }
  | { type: 'text'; value: string }
  | { type: 'cdata'; value: string }
  | { type: 'comment'; value: string }
  | { type: 'instruction'; target: string; value: string };

export type XmlDocument = { declaration?: string; nodes: XmlNode[] };

export type FormatResult =
  | { ok: true; document: XmlDocument; unescaped: boolean }
  | { ok: false; error: string };

export const INDENT = '  ';
const MAX_UNESCAPE_PASSES = 3;

export function extractXml(input: string): string | null {
  const start = input.indexOf('<');
  const end = input.lastIndexOf('>');
  if (start === -1 || end < start) return null;
  return input.slice(start, end + 1);
}

// `\"` and `\/` never appear in plain XML. `\n`-style escapes only count when the text has no
// real line breaks, so Windows paths like C:\new in already-clean XML aren't mangled.
export function isEscaped(text: string): boolean {
  return /\\["/]/.test(text) || (/\\[nrtu]/.test(text) && !/[\r\n]/.test(text));
}

export function unescapeJsonString(text: string): string {
  return text.replace(/\\(u[0-9a-f]{4}|["\\/bfnrt])/gi, (_, seq: string) => {
    switch (seq[0]) {
      case 'u':
      case 'U':
        return String.fromCharCode(Number.parseInt(seq.slice(1), 16));
      case 'b':
        return '\b';
      case 'f':
        return '\f';
      case 'n':
        return '\n';
      case 'r':
        return '\r';
      case 't':
        return '\t';
      default:
        return seq;
    }
  });
}

export function unescapeRepeatedly(text: string): { text: string; unescaped: boolean } {
  let current = text;
  let passes = 0;
  while (passes < MAX_UNESCAPE_PASSES && isEscaped(current)) {
    current = unescapeJsonString(current);
    passes++;
  }
  return { text: current, unescaped: passes > 0 };
}

function toNode(node: Node): XmlNode | null {
  switch (node.nodeType) {
    case Node.ELEMENT_NODE: {
      const el = node as Element;
      return {
        type: 'element',
        name: el.nodeName,
        attributes: Array.from(el.attributes, ({ name, value }) => ({ name, value })),
        children: toNodes(el.childNodes),
      };
    }
    case Node.TEXT_NODE: {
      const value = node.nodeValue ?? '';
      return value.trim() ? { type: 'text', value } : null;
    }
    case Node.CDATA_SECTION_NODE:
      return { type: 'cdata', value: node.nodeValue ?? '' };
    case Node.COMMENT_NODE:
      return { type: 'comment', value: node.nodeValue ?? '' };
    case Node.PROCESSING_INSTRUCTION_NODE:
      return {
        type: 'instruction',
        target: (node as ProcessingInstruction).target,
        value: node.nodeValue ?? '',
      };
    default:
      return null;
  }
}

function toNodes(list: NodeListOf<ChildNode>): XmlNode[] {
  return Array.from(list, toNode).filter((n): n is XmlNode => n !== null);
}

function parserErrorMessage(error: Element): string {
  // Chromium wraps the message in a <div>; Firefox puts it in the first text node.
  const message =
    error.getElementsByTagName('div')[0]?.textContent ??
    error.firstChild?.textContent ??
    error.textContent ??
    '';
  return message.trim() || 'Invalid XML';
}

export function parseXml(xml: string): { document: XmlDocument } | { error: string } {
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  const error = doc.getElementsByTagName('parsererror')[0];
  if (error) return { error: parserErrorMessage(error) };

  const declaration = /^\s*(<\?xml\s[\s\S]*?\?>)/.exec(xml)?.[1];
  return { document: { declaration, nodes: toNodes(doc.childNodes) } };
}

export function formatXml(input: string): FormatResult {
  const extracted = extractXml(input);
  if (!extracted) return { ok: false, error: 'No XML found in the input.' };

  const { text, unescaped } = unescapeRepeatedly(extracted);
  const parsed = parseXml(text);
  if ('error' in parsed) return { ok: false, error: parsed.error };

  return { ok: true, document: parsed.document, unescaped };
}

export function escapeText(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function escapeAttribute(value: string): string {
  return escapeText(value).replace(/"/g, '&quot;');
}

export function isInline(node: Extract<XmlNode, { type: 'element' }>): boolean {
  const [only] = node.children;
  return node.children.length === 1 && (only?.type === 'text' || only?.type === 'cdata');
}

function serializeAttributes(attributes: XmlAttribute[]): string {
  return attributes.map(({ name, value }) => ` ${name}="${escapeAttribute(value)}"`).join('');
}

function serializeNode(node: XmlNode, depth: number): string {
  const pad = INDENT.repeat(depth);
  switch (node.type) {
    case 'text':
      return pad + escapeText(node.value);
    case 'cdata':
      return `${pad}<![CDATA[${node.value}]]>`;
    case 'comment':
      return `${pad}<!--${node.value}-->`;
    case 'instruction':
      return `${pad}<?${node.target} ${node.value}?>`;
    case 'element': {
      const open = `<${node.name}${serializeAttributes(node.attributes)}`;
      if (!node.children.length) return `${pad}${open}/>`;
      if (isInline(node)) {
        return `${pad}${open}>${serializeNode(node.children[0]!, 0)}</${node.name}>`;
      }
      const children = node.children.map((child) => serializeNode(child, depth + 1));
      return [`${pad}${open}>`, ...children, `${pad}</${node.name}>`].join('\n');
    }
    default: {
      const unhandled: never = node;
      throw new Error(`Unhandled XML node: ${JSON.stringify(unhandled)}`);
    }
  }
}

export function serializeXml(document: XmlDocument): string {
  const lines = document.nodes.map((node) => serializeNode(node, 0));
  if (document.declaration) lines.unshift(document.declaration);
  return lines.join('\n');
}
