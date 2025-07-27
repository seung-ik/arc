const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputDir = 'src/assets/images/business';
const outputDir = 'src/assets/images/business';

async function compressImage(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .png({ quality: 80, compressionLevel: 9 })
      .toFile(outputPath);

    const originalSize = fs.statSync(inputPath).size;
    const compressedSize = fs.statSync(outputPath).size;
    const reduction = (
      ((originalSize - compressedSize) / originalSize) *
      100
    ).toFixed(1);

    console.log(
      `${path.basename(inputPath)}: ${(originalSize / 1024 / 1024).toFixed(1)}MB → ${(compressedSize / 1024 / 1024).toFixed(1)}MB (${reduction}% reduction)`
    );
  } catch (error) {
    console.error(`Error compressing ${inputPath}:`, error);
  }
}

async function compressAllImages() {
  const files = fs.readdirSync(inputDir).filter(file => file.endsWith('.png'));

  console.log('Compressing images...');

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputPath = path.join(outputDir, `compressed_${file}`);

    await compressImage(inputPath, outputPath);
  }

  console.log('Compression complete!');
}

compressAllImages();
