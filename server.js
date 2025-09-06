const express = require('express');
const multer = require('multer');
const { getCaption } = require('./captioner');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.post('/caption', upload.single('file'), async (req, res) => {
  try {
    const imageBuffer = req.file.buffer;
    const caption = await getCaption(imageBuffer);
    res.json({ caption });
  } catch (err) {
    console.error('Captioning error:', err);
    res.status(500).json({ error: 'Failed to generate caption' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});