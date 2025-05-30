import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure public directory exists
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create a simple UTBK Tracker logo as a placeholder
async function generateIcon() {
  try {
    const width = 1024;
    const height = 1024;
    const text = 'UTBK';
    
    // Create a simple SVG with text
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#2563eb"/>
        <text x="50%" y="50%" 
              font-family="Arial, sans-serif" 
              font-size="300" 
              font-weight="bold" 
              fill="white" 
              text-anchor="middle" 
              dominant-baseline="middle">
          ${text}
        </text>
      </svg>
    `;

    // Generate different icon sizes
    const sizes = [
      { name: 'favicon.ico', size: 32 },
      { name: 'icon-72x72.png', size: 72 },
      { name: 'icon-96x96.png', size: 96 },
      { name: 'icon-128x128.png', size: 128 },
      { name: 'icon-144x144.png', size: 144 },
      { name: 'icon-152x152.png', size: 152 },
      { name: 'icon-192x192.png', size: 192 },
      { name: 'icon-384x384.png', size: 384 },
      { name: 'icon-512x512.png', size: 512 },
      { name: 'apple-touch-icon.png', size: 180 },
      { name: 'maskable-icon.png', size: 512 },
    ];

    for (const { name, size } of sizes) {
      await sharp(Buffer.from(svg))
        .resize(size, size)
        .toFile(path.join(publicDir, name));
      console.log(`Generated ${name} (${size}x${size})`);
    }

    console.log('\n✅ All PWA assets generated successfully!');
  } catch (error) {
    console.error('Error generating PWA assets:', error);
    process.exit(1);
  }
}

// Run the generator
generateIcon().catch(console.error);
