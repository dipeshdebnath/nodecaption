const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const OPENAI_API_KEY = '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'; // Replace with your actual key

app.post('/caption', async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl || !imageUrl.endsWith('.jpg')) {
    return res.status(400).json({ error: 'Valid .jpg imageUrl is required' });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: 'Describe this image in one sentence.' },
              { type: 'image_url', image_url: { url: imageUrl } }
            ]
          }
        ],
        max_tokens: 100
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const caption = response.data.choices[0].message.content;
    res.json({ caption });
  } catch (error) {
    console.error('Error generating caption:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate caption' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Caption server running on port ${PORT}`);
});