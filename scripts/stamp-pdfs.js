const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

async function stampAllPdfs() {
  const logoPath = path.join(__dirname, '../public/assets/logo-reussir-polytech.jpg');
  const stampPath = path.join(__dirname, '../public/assets/cachet-direction-generale.jpg');

  if (!fs.existsSync(logoPath)) {
    throw new Error(`Logo file not found: ${logoPath}`);
  }
  if (!fs.existsSync(stampPath)) {
    throw new Error(`Stamp file not found: ${stampPath}`);
  }

  const logoBytes = fs.readFileSync(logoPath);
  const stampBytes = fs.readFileSync(stampPath);

  const originalsDir = path.join(__dirname, '../documents-source');
  const targetDir = path.join(__dirname, '../public/documents');

  function getFiles(dir, files = []) {
    if (!fs.existsSync(dir)) return files;
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
        getFiles(fullPath, files);
      } else if (file.endsWith('.pdf')) {
        files.push(fullPath);
      }
    }
    return files;
  }

  const pdfFiles = getFiles(originalsDir);
  console.log(`Found ${pdfFiles.length} PDF files to stamp...`);

  for (const filePath of pdfFiles) {
    const relative = path.relative(originalsDir, filePath);
    const destPath = path.join(targetDir, relative);
    console.log(`Stamping: ${relative} -> ${destPath}`);

    const existingPdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const logoImage = await pdfDoc.embedJpg(logoBytes);
    const stampImage = await pdfDoc.embedJpg(stampBytes);
    const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pages = pdfDoc.getPages();
    const totalPages = pages.length;

    for (let i = 0; i < totalPages; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();

      // Proportional Logo placement at top-right
      const logoScale = 90 / logoImage.width;
      const logoWidth = logoImage.width * logoScale;
      const logoHeight = logoImage.height * logoScale;

      page.drawImage(logoImage, {
        x: width - logoWidth - 20,
        y: height - logoHeight - 12,
        width: logoWidth,
        height: logoHeight,
      });

      // Circular Stamp placement at bottom-right
      const stampScale = 76 / stampImage.width;
      const stampWidth = stampImage.width * stampScale;
      const stampHeight = stampImage.height * stampScale;

      page.drawImage(stampImage, {
        x: width - stampWidth - 18,
        y: 16,
        width: stampWidth,
        height: stampHeight,
        opacity: 0.94,
      });

      // Official institutional banner at bottom-left
      page.drawText('RÉUSSIR POLYTECH — DIRECTION GÉNÉRALE', {
        x: 24,
        y: 22,
        size: 6.5,
        font: helveticaBold,
        color: rgb(0.04, 0.1, 0.22),
      });

      page.drawText('Groupe d\'Étude Académique Éseka • Document Certifié Conforme', {
        x: 24,
        y: 13,
        size: 5.5,
        font: helvetica,
        color: rgb(0.35, 0.4, 0.45),
      });
    }

    const modifiedPdfBytes = await pdfDoc.save();
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, modifiedPdfBytes);
    console.log(`✓ Successfully stamped and saved: ${destPath}`);
  }

  console.log('All documents stamped successfully!');
}

stampAllPdfs().catch((err) => {
  console.error('Error stamping PDFs:', err);
  process.exit(1);
});
