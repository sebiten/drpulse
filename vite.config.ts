import { defineConfig } from 'vite';
import { renderPage } from './src/page';
import { localeKeys, localePath, seoHead, siteUrl } from './src/seo';
import type { Locale } from './src/locales';

function localize(html: string, locale: Locale): string {
  return html.replace(/<html lang="[^"]*">/, `<html lang="${locale}">`)
    .replace(/<!--seo-start-->[\s\S]*?<!--seo-end-->/, () => `<!--seo-start-->${seoHead(locale)}<!--seo-end-->`)
    .replace(/<div id="app">[\s\S]*?<!--app-end-->/, () => `<div id="app">${renderPage(locale)}</div><!--app-end-->`);
}

export default defineConfig({
  plugins: [{
    name: 'localized-static-pages',
    transformIndexHtml: {
      order: 'pre',
      handler(html, context) {
        const segment = context.path.split('/')[1];
        const locale = localeKeys.find(key => key === segment) ?? 'en';
        return localize(html, locale);
      },
    },
    generateBundle: {
      order: 'post',
      handler(_, bundle) {
        const entry = bundle['index.html'];
        if (!entry || entry.type !== 'asset') throw new Error('Missing HTML entry');
        const html = String(entry.source);
        for (const locale of localeKeys.filter(key => key !== 'en')) {
          this.emitFile({ type: 'asset', fileName: `${locale}/index.html`, source: localize(html, locale) });
        }
        const alternates = [...localeKeys.map(key => `<xhtml:link rel="alternate" hreflang="${key}" href="${siteUrl}${localePath(key)}"/>`), `<xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/"/>`].join('');
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${localeKeys.map(key => `<url><loc>${siteUrl}${localePath(key)}</loc>${alternates}</url>`).join('')}</urlset>` });
        this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n` });
      },
    },
  }],
});
