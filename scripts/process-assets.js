const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processGlobe() {
  const inputPath = path.join(__dirname, '../public/assets/globe-terrestre.jpg');
  const outputPath = path.join(__dirname, '../public/assets/globe-transparent.png');
  
  const size = 736;
  const cx = 366;
  const cy = 366;
  const r = 308;

  // Circular mask with soft anti-aliased edge
  const svgMask = `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="edgeFade" cx="50%" cy="50%" r="50%">
          <stop offset="98.5%" stop-color="white" stop-opacity="1"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#edgeFade)" />
    </svg>
  `;

  await sharp(inputPath)
    .composite([{
      input: Buffer.from(svgMask),
      blend: 'dest-in'
    }])
    .png()
    .toFile(outputPath);

  console.log('✓ globe-transparent.png created successfully!');
}

async function processIcons() {
  const logoPath = path.join(__dirname, '../public/assets/logo-official-3d.jpg');
  const iconsDir = path.join(__dirname, '../public/icons');

  // Load logo metadata
  const meta = await sharp(logoPath).metadata();
  const width = meta.width;
  const height = meta.height;
  const minDim = Math.min(width, height);
  const cx = width / 2;
  const cy = height / 2;
  const r = minDim / 2;

  // Circular mask for round PWA icon
  const roundSvgMask = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="white" />
    </svg>
  `;

  // Circular masked image
  const roundBuffer = await sharp(logoPath)
    .composite([{
      input: Buffer.from(roundSvgMask),
      blend: 'dest-in'
    }])
    .png()
    .toBuffer();

  // Generate 512x512
  await sharp(roundBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'icon-512x512.png'));

  // Generate 192x192
  await sharp(roundBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(iconsDir, 'icon-192x192.png'));

  // Generate apple-touch-icon (180x180)
  await sharp(roundBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(iconsDir, 'apple-touch-icon.png'));

  // For maskable icon: Chrome expects some padding around the circle so it doesn't get clipped
  const padSize = 512;
  const innerSize = 410; // ~80% safe zone
  const innerIcon = await sharp(roundBuffer).resize(innerSize, innerSize).png().toBuffer();

  await sharp({
    create: {
      width: padSize,
      height: padSize,
      channels: 4,
      background: { r: 5, g: 11, b: 20, alpha: 1 } // #050B14 Polytech Night background
    }
  })
    .composite([{
      input: innerIcon,
      gravity: 'center'
    }])
    .png()
    .toFile(path.join(iconsDir, 'maskable-icon-512x512.png'));

  // Generate public/assets/logo-polytech.png as transparent round logo
  await sharp(roundBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(__dirname, '../public/assets/logo-polytech.png'));

  console.log('✓ All PWA circular icons and logo-polytech.png generated successfully!');
}

async function main() {
  await processGlobe();
  await processIcons();
}

main().catch(console.error);
