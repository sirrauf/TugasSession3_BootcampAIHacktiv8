import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';

const app = express();
const upload = multer();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMINI_MODEL = 'gemini-3.6-flash';

const SYSTEM_PROMPT = `Kamu adalah "NusantaraBot", seorang asisten AI yang sangat ahli dan bersemangat tentang Indonesia.
Kamu memiliki pengetahuan mendalam tentang:
- Suku dan Adat Istiadat: Berbagai suku bangsa di Indonesia (Jawa, Sunda, Batak, Bugis, Dayak, Papua, dll), tradisi, upacara adat, pakaian tradisional, dan kebudayaan mereka.
- Budaya dan Seni: Tari tradisional, musik daerah, wayang, batik, tenun, dan berbagai kesenian Indonesia.
- Makanan dan Kuliner: Masakan khas daerah, jajanan tradisional, cara memasak, bahan-bahan lokal, dan rekomendasi kuliner dari Sabang sampai Merauke.
- Tempat Wisata: Destinasi wisata alam, wisata budaya, wisata sejarah, kuliner, dan tersembunyi di seluruh Indonesia.

Panduan menjawab:
- Selalu jawab dengan antusias dan ramah dalam Bahasa Indonesia.
- Berikan informasi yang akurat, menarik, dan informatif.
- Gunakan emoji yang relevan untuk membuat jawaban lebih hidup.
- Jika pertanyaan di luar topik Indonesia (suku, budaya, makanan, wisata), arahkan kembali ke topik tersebut dengan sopan.
- Berikan rekomendasi spesifik ketika diminta.
- Format jawaban dengan rapi menggunakan poin-poin jika diperlukan.`;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3001', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST'],
}));

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server NusantaraBot ready on http://localhost:' + PORT);
});

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'NusantaraBot API is running!' });
});

app.post('/chat', async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Parameter "message" wajib diisi.' });
  }

  try {
    const contents = [
      ...history.map((h) => ({
        role: h.role,
        parts: [{ text: h.text }],
      })),
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.error('Chat error:', e);
    res.status(500).json({ message: e.message });
  }
});

app.post('/generate-text', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: { systemInstruction: SYSTEM_PROMPT },
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

app.post('/generate-from-image', upload.single('image'), async (req, res) => {
  const { prompt } = req.body;
  const base64Image = req.file.buffer.toString('base64');

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { text: prompt || 'Deskripsikan gambar ini dalam konteks budaya Indonesia.', type: 'text' },
        { inlineData: { data: base64Image, mimeType: req.file.mimetype } },
      ],
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

app.post('/generate-from-document', upload.single('document'), async (req, res) => {
  const { prompt } = req.body;
  const base64Document = req.file.buffer.toString('base64');

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { text: prompt || 'Buat ringkasan dari dokumen berikut.', type: 'text' },
        { inlineData: { data: base64Document, mimeType: req.file.mimetype } },
      ],
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

app.post('/generate-from-audio', upload.single('audio'), async (req, res) => {
  const { prompt } = req.body;
  const base64Audio = req.file.buffer.toString('base64');

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        { text: prompt || 'Buatkan transkrip dari audio berikut.', type: 'text' },
        { inlineData: { data: base64Audio, mimeType: req.file.mimetype } },
      ],
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});
