const fs = require('fs');
const path = require('path');

// Base URL of your site
const siteUrl = 'https://utbk2025.hanifu.id';

// Define your routes
const routes = [
  '', // Homepage
  'dashboard',
  'universitas',
  'program'
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes
    .map(route => {
      return `
    <url>
      <loc>${`${siteUrl}/${route}`}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>${route === '' ? 1.0 : 0.8}</priority>
    </url>`;
    })
    .join('')}
</urlset>`;

// Create public directory if it doesn't exist
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write sitemap to public directory
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);

console.log('Sitemap generated successfully!');
