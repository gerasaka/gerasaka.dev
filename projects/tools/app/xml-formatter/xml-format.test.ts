import { describe, expect, it } from 'vitest';
import {
  extractXml,
  formatXml,
  isEscaped,
  serializeXml,
  unescapeJsonString,
  unescapeRepeatedly,
} from './xml-format';

function format(input: string): string {
  const result = formatXml(input);
  if (!result.ok) throw new Error(result.error);
  return serializeXml(result.document);
}

describe('extractXml', () => {
  it('strips log prefixes and suffixes', () => {
    expect(extractXml('2026-10-01 INFO response=<a>1</a> (12ms)')).toBe('<a>1</a>');
  });

  it('returns null when there is no XML', () => {
    expect(extractXml('just a log line')).toBeNull();
  });
});

describe('isEscaped', () => {
  it.each([
    [String.raw`<a x=\"1\"/>`, true],
    [String.raw`<a>1<\/a>`, true],
    [String.raw`<a>\n<b/>\n</a>`, true],
    ['<a x="1">\n  <b/>\n</a>', false],
    ['<path>C:\\new\\temp</path>\n', false],
  ])('%s -> %s', (input, expected) => {
    expect(isEscaped(input)).toBe(expected);
  });
});

describe('unescapeJsonString', () => {
  it('decodes JSON escapes including unicode', () => {
    expect(unescapeJsonString(String.raw`<a x=\"1\">\u6771\u4eac<\/a>\r\n\t`)).toBe(
      '<a x="1">東京</a>\r\n\t',
    );
  });

  it('keeps escaped backslashes as a single backslash', () => {
    expect(unescapeJsonString(String.raw`C:\\temp`)).toBe('C:\\temp');
  });
});

describe('unescapeRepeatedly', () => {
  it('handles double-escaped input', () => {
    expect(unescapeRepeatedly(String.raw`<a x=\\\"1\\\"><\\\/a>`)).toEqual({
      text: '<a x="1"></a>',
      unescaped: true,
    });
  });

  it('leaves clean XML untouched', () => {
    expect(unescapeRepeatedly('<a x="1"/>')).toEqual({ text: '<a x="1"/>', unescaped: false });
  });
});

describe('formatXml', () => {
  it('formats a JSON-escaped payload with messy whitespace', () => {
    const input = String.raw`<OrderRequest xmlns:i=\"http:\/\/www.w3.org\/2001\/XMLSchema-instance\" xmlns=\"http:\/\/example.com\/orders\/v1\">\n <User>\r\n <ID>USR-0001<\/ID>\r\n <\/User>\r\n\n <Items>\n \n<Item i:type=\"Standard\">\n\t<Sku>SKU-001<\/Sku>\n <\/Item>\n\n\n <\/Items>\n<\/OrderRequest>`;

    expect(format(input)).toBe(
      [
        '<OrderRequest xmlns:i="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://example.com/orders/v1">',
        '  <User>',
        '    <ID>USR-0001</ID>',
        '  </User>',
        '  <Items>',
        '    <Item i:type="Standard">',
        '      <Sku>SKU-001</Sku>',
        '    </Item>',
        '  </Items>',
        '</OrderRequest>',
      ].join('\n'),
    );
  });

  it('reports whether the input was unescaped', () => {
    const escaped = formatXml(String.raw`<a>1<\/a>`);
    const clean = formatXml('<a>1</a>');
    expect(escaped.ok && escaped.unescaped).toBe(true);
    expect(clean.ok && clean.unescaped).toBe(false);
  });

  it('keeps values exactly, including surrounding spaces', () => {
    expect(format('<a><b>  Fake Person </b></a>')).toBe('<a>\n  <b>  Fake Person </b>\n</a>');
  });

  it('re-escapes special characters in text and attributes', () => {
    expect(format('<a note="x &amp; &quot;y&quot;">1 &lt; 2 &amp; 3</a>')).toBe(
      '<a note="x &amp; &quot;y&quot;">1 &lt; 2 &amp; 3</a>',
    );
  });

  it('self-closes empty elements', () => {
    expect(format('<a><b></b><c/><d>   </d></a>')).toBe('<a>\n  <b/>\n  <c/>\n  <d/>\n</a>');
  });

  it('preserves the declaration, comments, CDATA and processing instructions', () => {
    const input =
      '<?xml version="1.0" encoding="UTF-8"?><?app mode="debug"?><a><!-- note --><b><![CDATA[<raw> & stuff]]></b></a>';
    expect(format(input)).toBe(
      [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<?app mode="debug"?>',
        '<a>',
        '  <!-- note -->',
        '  <b><![CDATA[<raw> & stuff]]></b>',
        '</a>',
      ].join('\n'),
    );
  });

  it('returns a parser error for malformed XML', () => {
    const result = formatXml('<a><b></a>');
    expect(result.ok).toBe(false);
    expect(!result.ok && result.error.length).toBeGreaterThan(0);
  });

  it('returns an error when there is no XML at all', () => {
    expect(formatXml('nothing here')).toEqual({ ok: false, error: 'No XML found in the input.' });
  });
});
