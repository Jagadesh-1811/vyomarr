const stripScripts = (html = '') =>
  html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<script[^>]*>/gi, '');

const stripDocShell = (html = '') =>
  html
    .replace(/<!doctype[^>]*>/i, '')
    .replace(/<\/?html[^>]*>/gi, '')
    .replace(/<\/?head[^>]*>/gi, '')
    .replace(/<\/?meta[^>]*>/gi, '')
    .replace(/<\/?title[^>]*>/gi, '')
    .replace(/<\/?link[^>]*>/gi, '');

export const buildLegacyContent = (rawHtml = '') => {
  if (!rawHtml) return '';

  const withoutShell = stripDocShell(stripScripts(rawHtml));

  const styleBlocks = Array.from(
    withoutShell.matchAll(/<style[^>]*>[\s\S]*?<\/style>/gi),
  )
    .map((match) => match[0])
    .join('\n');

  const bodyMatch = withoutShell.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const body = bodyMatch ? bodyMatch[1] : withoutShell;

  const cleanedBody = body
    .replace(/<div\s+id=["']navbar["'][^>]*><\/div>/gi, '')
    .replace(/<div\s+id=["']footer["'][^>]*><\/div>/gi, '')
    .trim();

  return `${styleBlocks}\n${cleanedBody}`.trim();
};

