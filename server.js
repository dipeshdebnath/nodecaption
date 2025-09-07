const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const openaiApiKey = process.env.OPENAI_API_KEY;


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
          'Authorization': `Bearer ${openaiApiKey}`,
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