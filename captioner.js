const { pipeline } = require('@xenova/transformers');
const sharp = require('sharp');

let captioner = null;

// Load model once at startup
async function loadModel() {
  if (!captioner) {
    captioner = await pipeline('image-to-text', 'nlpconnect/vit-gpt2-image-captioning');
    console.log('Model loaded');
  }
}

// Preprocess image buffer and generate caption
async function getCaption(imageBuffer) {
  await loadModel();

  // Resize and normalize image for model input
  const processedImage = await sharp(imageBuffer)
    .resize(224, 224)
    .toFormat('png')
    .toBuffer();

  const result = await captioner(processedImage);
  return result[0].generated_text;
}

module.exports = { getCaption };