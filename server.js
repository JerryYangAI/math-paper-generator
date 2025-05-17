const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/generate-paper', async (req, res) => {
  const { grade, difficulty } = req.body;
  const prompt = `请根据以下要求生成一张数学试卷：
年级：${grade}
难度：${difficulty}
包含10道题，适合该年级
格式如下：{"questions": [...], "answers": [...]}`;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const result = JSON.parse(completion.data.choices[0].message.content);
    res.json(result);
  } catch (err) {
    console.error('生成失败：', err);
    res.status(500).json({ error: '生成失败' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
