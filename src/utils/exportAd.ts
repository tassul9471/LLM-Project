import { AdContent } from '../types/index.js';

interface ExportAdParams {
  productName: string;
  platform: string;
  tone: string;
  content: AdContent;
}

export function exportAdToTextFile({ productName, platform, tone, content }: ExportAdParams): string {
  const textContent = `AI AD GENERATOR
==============================

PRODUCT:
${productName || 'Product'}

PLATFORM:
${platform || 'General'}

TONE:
${tone || 'Modern'}

------------------------------

HEADLINE:
${content.headline || ''}

------------------------------

SHORT DESCRIPTION:
${content.shortDescription || ''}

------------------------------

LONG DESCRIPTION:
${content.longDescription || ''}

------------------------------

TAGLINE:
${content.tagline || ''}

------------------------------

PROMOTIONAL MESSAGE:
${content.promotionalMessage || ''}

------------------------------

CALL TO ACTION:
${content.callToAction || ''}

------------------------------

SOCIAL MEDIA COPY:
${content.socialMediaCopy || ''}

==============================

Generated using AI Ad Generator
`;

  // Sanitize product name for filename: only keep alphanumeric and underscores
  const cleanName = (productName || 'Product')
    .trim()
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_');
  const filename = `AI_Ad_${cleanName}.txt`;

  // Create Blob and trigger download in browser
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return filename;
}
